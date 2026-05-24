const HTTP_STATUS = require('../constants/httpStatus');
const HTTP_CODE = require('../constants/httpCode');

module.exports = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);

      next();
    } catch (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        http_code: HTTP_CODE.VALIDATION_ERROR,
        message: 'Validation failed',
        errors: error.errors
      });
    }
  };
};
