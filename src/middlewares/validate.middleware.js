const { ZodError } = require('zod');

const APIError = require('../classes/APIError');

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
          APIError.validation(formattedErrors[0]?.message || 'Validation failed', formattedErrors)
        );
      }

      next(error);
    }
  };
};
