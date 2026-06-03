const moment = require('moment');
const crypto = require('crypto');

const { PAGINATION } = require('../constants/index');

const getPaginationContext = (req) => {
  const page_index = parseInt(req.body.page_index) || PAGINATION.PAGE_INDEX;
  const page_size = parseInt(req.body.page_size) || PAGINATION.PAGE_SIZE;

  const offset = (page_index - 1) * page_size;

  return { page_index, page_size, offset };
};

const hashToken = (token) => {
  return crypto.createHmac('sha256', process.env.TOKEN_HASH_SECRET).update(token).digest('hex');
};

const generateSecureToken = (length = 64) => {
  const random = crypto.randomBytes(length).toString('hex');
  const timestamp = moment().valueOf().toString(36);

  return `${timestamp}.${random}`;
};

module.exports = {
  getPaginationContext,
  hashToken,
  generateSecureToken
};
