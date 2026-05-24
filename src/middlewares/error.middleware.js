const APIError = require('../classes/APIError.js');

const HTTP_CODE = require('../constants/httpCode');
const HTTP_STATUS = require('../constants/httpStatus.js');

const logger = require('../utils/logger.util.js');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error({
    type: 'error',
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip
  });

  if (err instanceof APIError) {
    return res.status(err.http_status).json({
      http_code: err.http_code,
      message: err.message,
      data: err.data
    });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    http_code: HTTP_CODE.INTERNAL_SERVER_ERROR,
    message: err.message || 'Internal Server Error',
    data: null
  });
};

module.exports = errorHandler;
