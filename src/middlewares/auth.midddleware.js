const jwt = require('jsonwebtoken');

const db = require('../../models/index');
const { User } = db;

const APIError = require('../classes/APIError.js');

const redisUtil = require('../utils/redis.util.js');

const auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw APIError.unauthorized('Authorization token is required');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw APIError.unauthorized('Invalid authorization format');
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch {
      throw APIError.unauthorized('Invalid or expired token');
    }

    const session = await redisUtil.get(`session:${decoded.user_id}`);

    if (!session) {
      throw APIError.unauthorized('Session expired');
    }

    if (session.access_token !== token) {
      throw APIError.unauthorized('Invalid session token');
    }

    let user = session;

    if (!user) {
      const findUser = await User.findByPk(decoded.user_id);

      if (!findUser) {
        throw APIError.unauthorized('User not found');
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
