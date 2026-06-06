const { publisher, subscriber } = require('../../config/redis');

const logger = require('./logger.util.js');

const handlers = new Map();
let initialized = false;

const serialize = (payload) => {
  return typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
};

const parse = (message) => {
  try {
    return JSON.parse(message);
  } catch {
    return message;
  }
};

const publish = async (channel, payload) => {
  return publisher.publish(channel, serialize(payload));
};

const subscribe = (channel, handler) => {
  if (!handlers.has(channel)) {
    handlers.set(channel, new Set());
    subscriber.subscribe(channel);
  }

  handlers.get(channel).add(handler);
};

const unsubscribe = async (channel, handler) => {
  const channelHandlers = handlers.get(channel);

  if (!channelHandlers) {
    return;
  }

  channelHandlers.delete(handler);

  if (channelHandlers.size === 0) {
    handlers.delete(channel);
    await subscriber.unsubscribe(channel);
  }
};

const initSubscriber = () => {
  if (initialized) {
    return;
  }

  initialized = true;

  subscriber.on('message', (channel, message) => {
    const channelHandlers = handlers.get(channel);

    if (!channelHandlers) {
      return;
    }

    const payload = parse(message);

    for (const handler of channelHandlers) {
      Promise.resolve(handler(payload, channel)).catch((error) => {
        logger.error('PubSub handler error', {
          channel,
          message: error.message,
          stack: error.stack
        });
      });
    }
  });

  logger.info('Redis pub/sub subscriber initialized');
};

module.exports = {
  publish,
  subscribe,
  unsubscribe,
  initSubscriber
};
