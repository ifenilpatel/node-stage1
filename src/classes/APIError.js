const HTTP_CODE = require('../constants/httpCode.js');
const HTTP_STATUS = require('../constants/httpStatus.js');

class APIError extends Error {
  constructor({ http_status, http_code, message, data = null, isOperational = true, cause }) {
    super(message, { cause });

    this.name = 'APIError';
    this.http_status = http_status;
    this.http_code = http_code;
    this.data = data;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      http_code: this.http_code,
      message: this.message,
      data: this.data
    };
  }

  static create(http_status, http_code, message, data = null) {
    return new APIError({ http_status, http_code, message, data });
  }

  static badRequest(message = 'Bad request.', data = null) {
    return APIError.create(HTTP_STATUS.BAD_REQUEST, HTTP_CODE.BAD_REQUEST, message, data);
  }

  static unauthorized(message = 'Unauthorized.', data = null) {
    return APIError.create(HTTP_STATUS.UNAUTHORIZED, HTTP_CODE.UNAUTHORIZED, message, data);
  }

  static forbidden(message = 'You do not have permission.', data = null) {
    return APIError.create(HTTP_STATUS.FORBIDDEN, HTTP_CODE.FORBIDDEN, message, data);
  }

  static notFound(message = 'Resource not found.', data = null) {
    return APIError.create(HTTP_STATUS.NOT_FOUND, HTTP_CODE.NOT_FOUND, message, data);
  }

  static noData(message = 'Data not found.', data = null) {
    return APIError.create(HTTP_STATUS.NOT_FOUND, HTTP_CODE.DATA_NOT_FOUND, message, data);
  }

  static validation(message = 'Validation failed.', data = null) {
    return APIError.create(HTTP_STATUS.BAD_REQUEST, HTTP_CODE.VALIDATION_ERROR, message, data);
  }

  static conflict(message = 'Conflict.', data = null) {
    return APIError.create(HTTP_STATUS.CONFLICT, HTTP_CODE.CONFLICT, message, data);
  }

  static tooManyRequests(message = 'Too many requests.', data = null) {
    return APIError.create(
      HTTP_STATUS.TOO_MANY_REQUESTS,
      HTTP_CODE.TOO_MANY_REQUESTS,
      message,
      data
    );
  }

  static internal(message = 'Internal Server Error', data = null) {
    return APIError.create(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      message,
      data
    );
  }
}

module.exports = APIError;
