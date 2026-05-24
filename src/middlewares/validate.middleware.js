const { ZodError } = require('zod');

const APIError = require('../classes/APIError');

const HTTP_STATUS = require('../constants/httpStatus');
const HTTP_CODE = require('../constants/httpCode');

module.exports = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join('.') || 'body',
          message: issue.message
        }));

        return next(
          new APIError({
            http_status: HTTP_STATUS.BAD_REQUEST,
            http_code: HTTP_CODE.VALIDATION_ERROR,
            message: formattedErrors[0]?.message || 'Validation failed',
            data: formattedErrors
          })
        );
      }

      next(error);
    }
  };
};
