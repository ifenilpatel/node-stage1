const { Worker } = require('bullmq');

const db = require('../../../models');
const { Job } = db;

const redis = require('../../../config/redis.js');

const logger = require('../../utils/logger.util.js');

const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    const { job_id, event, payload } = job.data;

    const dbJob = await Job.findByPk(job_id);

    if (dbJob) {
      await dbJob.update({
        status: 'PROCESSING',
        attempts: job.attemptsMade + 1,
        processed_at: new Date()
      });
    }

    switch (event) {
      case 'REGISTER':
        logger.info('Processing REGISTER email', payload);
        break;

      case 'FORGOT_PASSWORD':
        logger.info('Processing FORGOT_PASSWORD email', payload);
        break;

      case 'CHANGE_PASSWORD':
        logger.info('Processing CHANGE_PASSWORD email', payload);
        break;

      default:
        throw new Error(`Unknown email event ${event}`);
    }

    if (dbJob) {
      await dbJob.update({ status: 'COMPLETED', processed_at: new Date() });

      logger.info(`Job completed ${job_id}`);
    }

    return true;
  },
  {
    connection: redis,
    concurrency: 5
  }
);

emailWorker.on('completed', (job) => {
  logger.info(`Job completed ${job.id}`);
});

emailWorker.on('failed', async (job, error) => {
  logger.error(`Job failed ${job?.id}`, {
    message: error.message,
    stack: error.stack
  });

  if (!job?.data?.job_id) {
    return;
  }

  const dbJob = await Job.findByPk(job.data.job_id);

  if (dbJob) {
    await dbJob.update({
      status: 'FAILED',
      failed_reason: error.message,
      attempts: (job?.attemptsMade || 0) + 1,
      processed_at: new Date()
    });
  }
});

emailWorker.on('error', (error) => {
  logger.error('BullMQ Worker Error', {
    message: error.message,
    stack: error.stack
  });
});

module.exports = emailWorker;
