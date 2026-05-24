const db = require('../../models');
const { User } = db;

const APIError = require('../classes/APIError');

const { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } = require('../constants/index');
const HTTP_CODE = require('../constants/httpCode');
const HTTP_STATUS = require('../constants/httpStatus');

const redisUtil = require('../utils/redis.util');
const { generateToken } = require('../utils/token.util');

const signIn = async ({ first_name }) => {
  const findUser = await User.findOne({ where: { first_name: first_name } });

  if (!findUser) {
    throw new APIError({
      http_status: HTTP_STATUS.BAD_REQUEST,
      http_code: HTTP_CODE.BAD_REQUEST,
      message: 'Invalid email or password'
    });
  }

  const access_token = generateToken({
    payload: {
      user_id: findUser.user_id,
      type: 'AccessToken'
    },
    ttl: ACCESS_TOKEN_TTL
  });

  const refresh_token = generateToken({
    payload: {
      user_id: findUser.user_id,
      type: 'RefreshToken'
    },
    ttl: REFRESH_TOKEN_TTL
  });

  const result = {
    user_id: findUser.user_id,
    first_name: findUser.first_name,
    access_token,
    refresh_token
  };

  await redisUtil.set({
    key: `session:${findUser.user_id}`,
    value: result,
    ttl: ACCESS_TOKEN_TTL
  });

  return result;
};

module.exports = {
  signIn
};
