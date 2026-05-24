const Redis = require('ioredis');

const logger = require('../src/utils/logger.util.js');

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,

  reconnectOnError: () => true
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('ready', () => {
  logger.info('Redis ready');
});

redis.on('error', (error) => {
  logger.error('Redis error', { message: error.message, stack: error.stack });
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});

module.exports = redis;
