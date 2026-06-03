const { Queue } = require('bullmq');

const redis = require('../../config/redis');

const emailQueue = new Queue('emailQueue', {
  connection: redis
});

const pushNotificationQueue = new Queue('pushNotificationQueue', {
  connection: redis
});

module.exports = {
  emailQueue,
  pushNotificationQueue
};
