const TOKEN_SECRET_TTL = 60 * 15; // 15 minutes
const ACCESS_TOKEN_TTL = 60 * 15; // 15 minutes
const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 7; // 7 days

const PAGINATION = {
  PAGE_INDEX: 1,
  PAGE_SIZE: 10
};

module.exports = {
  TOKEN_SECRET_TTL,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  PAGINATION
};
