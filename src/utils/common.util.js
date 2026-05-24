const APIError = require('../classes/APIError');

const { PAGINATION } = require('../constants/index');
const HTTP_CODE = require('../constants/httpCode');
const HTTP_STATUS = require('../constants/httpStatus');

const getPaginationContext = (req) => {
  const page_index = parseInt(req.body.page_index) || PAGINATION.PAGE_INDEX;
  const page_size = parseInt(req.body.page_size) || PAGINATION.PAGE_SIZE;

  const offset = (page_index - 1) * page_size;

  return { page_index, page_size, offset };
};

const throwNoData = (message = 'Data not found.') => {
  throw new APIError(HTTP_STATUS.NOT_FOUND, HTTP_CODE.DATA_NOT_FOUND, message);
};

const throwBadRequest = (message = 'You do not have permission.') => {
  throw new APIError(HTTP_STATUS.BAD_REQUEST, HTTP_CODE.BAD_REQUEST, message);
};

const throwForbidden = (message = 'You do not have permission.') => {
  throw new APIError(HTTP_STATUS.FORBIDDEN, HTTP_CODE.FORBIDDEN, message);
};

module.exports = {
  getPaginationContext,
  throwNoData,
  throwBadRequest,
  throwForbidden
};
