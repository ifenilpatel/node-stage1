const jwt = require('jsonwebtoken');

const generateToken = ({ payload = {}, ttl = '7d' }) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: ttl });
};

const verifyToken = ({ token }) => {
  return jwt.verify(token, process.env.TOKEN_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
