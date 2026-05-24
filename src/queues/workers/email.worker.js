const { Worker } = require('bullmq');

const redis = require('../../../config/redis.js');

const logger = require('../../utils/logger.util.js');

const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    const { event, payload } = job.data;

    switch (event) {
      case 'REGISTER':
        console.log(payload);
        break;

      case 'FORGOT_PASSWORD':
        console.log(payload);
        break;

      case 'CHANGE_PASSWORD':
        console.log(payload);
        break;

      default:
        throw new Error(`Unknown email event ${event}`);
    }

    return true;
  },
  {
    connection: redis,
    concurrency: 5
  }
);

emailWorker.on('completed', (job) => {
  logger.info(`Email job completed ${job.id}`);
});

emailWorker.on('failed', (job, error) => {
  logger.error(`Email job failed ${job?.id}`, {
    message: error.message,
    stack: error.stack
  });
});

module.exports = emailWorker;
