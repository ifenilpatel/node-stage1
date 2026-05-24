const redis = require('../../config/redis');

const set = async ({ key, value, ttl }) => {
  const payload = typeof value === 'object' ? JSON.stringify(value) : value;

  return redis.set(key, payload, 'EX', ttl);
};

const get = async (key) => {
  const value = await redis.get(key);

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const del = async (key) => {
  return redis.del(key);
};

module.exports = {
  set,
  get,
  del
};
