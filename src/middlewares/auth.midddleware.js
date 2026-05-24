const jwt = require('jsonwebtoken');

const db = require('../../models/index');
const { User } = db;

const APIError = require('../classes/APIError.js');

const HTTP_CODE = require('../constants/httpCode');
const HTTP_STATUS = require('../constants/httpStatus');

const redisUtil = require('../utils/redis.util.js');

const auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new APIError({
        http_status: HTTP_STATUS.UNAUTHORIZED,
        http_code: HTTP_CODE.UNAUTHORIZED,
        message: 'Authorization token is required'
      });
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new APIError({
        http_status: HTTP_STATUS.UNAUTHORIZED,
        http_code: HTTP_CODE.UNAUTHORIZED,
        message: 'Invalid authorization format'
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch {
      throw new APIError({
        http_status: HTTP_STATUS.UNAUTHORIZED,
        http_code: HTTP_CODE.UNAUTHORIZED,
        message: 'Invalid or expired token'
      });
    }

    const session = await redisUtil.get(`session:${decoded.user_id}`);

    if (!session) {
      throw new APIError({
        http_status: HTTP_STATUS.UNAUTHORIZED,
        http_code: HTTP_CODE.UNAUTHORIZED,
        message: 'Session expired'
      });
    }

    if (session.access_token !== token) {
      throw new APIError({
        http_status: HTTP_STATUS.UNAUTHORIZED,
        http_code: HTTP_CODE.UNAUTHORIZED,
        message: 'Invalid session token'
      });
    }

    let user = session;

    if (!user) {
      const findUser = await User.findByPk(decoded.user_id);

      if (!findUser) {
        throw new APIError({
          http_status: HTTP_STATUS.UNAUTHORIZED,
          http_code: HTTP_CODE.UNAUTHORIZED,
          message: 'User not found'
        });
      }

      user = findUser;
    }

    req.user = {
      user_id: user.user_id,
      first_name: user.first_name
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  auth
};
