const db = require('../../models');
const { sequelize, Op, Department } = db;

const { throwNoData } = require('../utils/common.util.js');

const select = async (params) => {
  const { offset, page_index, page_size, selected_departments = [], search = {} } = params;

  const free_text = (search.free_text || '').trim();

  const andConditions = [{ is_active: true }];

  if (selected_departments.length) {
    andConditions.push({ department_id: { [Op.notIn]: selected_departments } });
  }

  if (free_text) {
    andConditions.push({
      [Op.or]: [{ title: { [Op.iLike]: `%${free_text}%` } }]
    });
  }

  const { rows, count } = await Department.findAndCountAll({
    where: { [Op.and]: andConditions },
    limit: page_size,
    offset,
    order: [['title', 'ASC']]
  });

  let selected = [];

  if (page_index === 1 && selected_departments.length) {
    selected = await Department.findAll({
      where: { department_id: selected_departments },
      order: [['title', 'ASC']]
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
  const { department_id } = params;

  const findDepartment = await Department.findOne({
    where: { department_id }
  });

  if (!findDepartment) {
    throwNoData('Department not found.');
  }

  return findDepartment;
};

const list = async (params) => {
  const { offset, page_index, page_size, search = {} } = params;

  const free_text = (search.free_text || '').trim();

  const status = ['active', 'inactive', 'all'].includes(search.status) ? search.status : 'active';

  const andConditions = [];

  if (free_text) {
    andConditions.push({
      [Op.or]: [{ title: { [Op.iLike]: `%${free_text}%` } }]
    });
  }

  if (status !== 'all') {
    andConditions.push({ is_active: status === 'active' });
  }

  const { rows, count } = await Department.findAndCountAll({
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
    const newUser = await Department.create(
      {
        code: params.code,
        title: params.title,
        is_active: params.is_active
      },
      { transaction: t }
    );

    await t.commit();

    return { inserted_id: newUser.department_id };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const update = async (params) => {
  const t = await sequelize.transaction();

  try {
    const findDepartment = await Department.findOne({
      where: { department_id: params.department_id },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!findDepartment) {
      throwNoData('Department not found.');
    }

    await findDepartment.update(
      {
        code: params.code,
        title: params.title,
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
  const { department_id } = params;

  const t = await sequelize.transaction();
  try {
    const findDepartment = await Department.findOne({
      where: { department_id },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!findDepartment) {
      throwNoData('Department not found.');
    }

    const is_active = !findDepartment.is_active;

    await findDepartment.update({ is_active }, { transaction: t });

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
