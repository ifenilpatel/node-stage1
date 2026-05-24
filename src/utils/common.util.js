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

const throwNoData = (message = 'Data not found.', data = null) => {
  throw new APIError({
    http_status: HTTP_STATUS.NOT_FOUND,
    http_code: HTTP_CODE.DATA_NOT_FOUND,
    message,
    data
  });
};

const throwBadRequest = (message = 'Bad request.', data = null) => {
  throw new APIError({
    http_status: HTTP_STATUS.BAD_REQUEST,
    http_code: HTTP_CODE.BAD_REQUEST,
    message,
    data
  });
};

const throwForbidden = (message = 'You do not have permission.', data = null) => {
  throw new APIError({
    http_status: HTTP_STATUS.FORBIDDEN,
    http_code: HTTP_CODE.FORBIDDEN,
    message,
    data
  });
};

module.exports = {
  getPaginationContext,
  throwNoData,
  throwBadRequest,
  throwForbidden
};
