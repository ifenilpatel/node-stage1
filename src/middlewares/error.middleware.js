const HTTP_STATUS = require('../constants/httpStatus');
const HTTP_CODE = require('../constants/httpCode');

const logger = require('../utils/logger.util');

module.exports = (err, req, res) => {
  logger.error(err.message, {
    stack: err.stack,
    path: req.originalUrl,
    method: req.method
  });

  return res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    http_code: err.http_code || HTTP_CODE.INTERNAL_SERVER_ERROR,
    message: err.message || 'Internal server error',
    errors: err.errors || null
  });
};
