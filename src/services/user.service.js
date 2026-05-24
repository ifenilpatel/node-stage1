const db = require('../../models');
const { sequelize, Op, User } = db;

const { throwNoData } = require('../utils/common.util.js');

const select = async (params) => {
  const { offset, page_index, page_size, selected_users = [], search = {} } = params;

  const free_text = (search.free_text || '').trim();

  const andConditions = [{ is_active: true }];

  if (selected_users.length) {
    andConditions.push({ user_id: { [Op.notIn]: selected_users } });
  }

  if (free_text) {
    andConditions.push({
      [Op.or]: [{ full_name: { [Op.iLike]: `%${free_text}%` } }]
    });
  }

  const { rows, count } = await User.findAndCountAll({
    where: { [Op.and]: andConditions },
    limit: page_size,
    offset,
    order: [['full_name', 'ASC']]
  });

  let selected = [];

  if (page_index === 1 && selected_users.length) {
    selected = await User.findAll({
      where: { user_id: selected_users },
      order: [['full_name', 'ASC']]
    });
  }

  return {
    total: count,
    page_index,
    page_size,
    selected,
    records: rows
  };
};

const detail = async (params) => {
  const { user_id } = params;

  const findUser = await User.findOne({
    where: { user_id }
  });

  if (!findUser) {
    throwNoData('User not found.');
  }

  return findUser;
};

const list = async (params) => {
  const { offset, page_index, page_size, search = {} } = params;

  const free_text = (search.free_text || '').trim();

  const status = ['active', 'inactive', 'all'].includes(search.status) ? search.status : 'active';

  const andConditions = [];

  if (free_text) {
    andConditions.push({
      [Op.or]: [{ full_name: { [Op.iLike]: `%${free_text}%` } }]
    });
  }

  if (status !== 'all') {
    andConditions.push({ is_active: status === 'active' });
  }

  const { rows, count } = await User.findAndCountAll({
    where: { [Op.and]: andConditions },
    limit: page_size,
    offset,
    order: [['created_at', 'DESC']]
  });

  return {
    total: count,
    page_index,
    page_size,
    data: rows
  };
};

const create = async (params) => {
  const t = await sequelize.transaction();

  try {
    const newUser = await User.create(
      {
        full_name: params.full_name,
        is_active: params.is_active
      },
      { transaction: t }
    );

    await t.commit();

    return { inserted_id: newUser.user_id };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const update = async (params) => {
  const t = await sequelize.transaction();

  try {
    const findUser = await User.findOne({
      where: { user_id: params.user_id },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!findUser) {
      throwNoData('User not found.');
    }

    await findUser.update(
      {
        full_name: params.full_name,
        is_active: params.is_active
      },
      { transaction: t }
    );

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const toggle = async (params) => {
  const { user_id } = params;

  const t = await sequelize.transaction();
  try {
    const findUser = await User.findOne({
      where: { user_id },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!findUser) {
      throwNoData('User not found.');
    }

    const is_active = !findUser.is_active;

    await findUser.update({ is_active }, { transaction: t });

    await t.commit();

    return { is_active };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

module.exports = {
  select,
  detail,
  list,
  create,
  update,
  toggle
};
