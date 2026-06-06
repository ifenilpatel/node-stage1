const { NOTIFICATION, SESSION_INVALIDATED } = require('../constants/redisChannels.js');
const logger = require('../utils/logger.util.js');
const pubsub = require('../utils/pubsub.util.js');

const registerPubSubHandlers = () => {
  pubsub.subscribe(NOTIFICATION, (payload) => {
    logger.info('PubSub notification received', payload);
  });

  pubsub.subscribe(SESSION_INVALIDATED, (payload) => {
    logger.info('PubSub session invalidated', payload);
  });
};

module.exports = registerPubSubHandlers;
