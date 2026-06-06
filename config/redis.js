require('../env.js');

const Redis = require('ioredis');

const logger = require('../src/utils/logger.util.js');

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  reconnectOnError: () => true
};

const attachListeners = (client, label) => {
  client.on('connect', () => {
    logger.info(`Redis ${label} connected`);
  });

  client.on('ready', () => {
    logger.info(`Redis ${label} ready`);
  });

  client.on('error', (error) => {
    logger.error(`Redis ${label} error`, { message: error.message, stack: error.stack });
  });

  client.on('close', () => {
    logger.warn(`Redis ${label} connection closed`);
  });
};

const createClient = (label) => {
  const client = new Redis(redisOptions);
  attachListeners(client, label);
  return client;
};

const redis = createClient('client');
const publisher = createClient('publisher');
const subscriber = createClient('subscriber');

const quitAll = async () => {
  await Promise.all([redis.quit(), publisher.quit(), subscriber.quit()]);
};

module.exports = redis;
module.exports.publisher = publisher;
module.exports.subscriber = subscriber;
module.exports.quitAll = quitAll;
