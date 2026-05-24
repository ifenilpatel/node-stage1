class APIError extends Error {
  constructor({ http_status, http_code, message, data = null }) {
    super(message);

    this.http_status = http_status;
    this.http_code = http_code;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = APIError;
