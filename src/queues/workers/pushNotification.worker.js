const { Worker } = require('bullmq');

const redis = require('../../../config/redis.js');

const logger = require('../../utils/logger.util.js');

const pushNotificationWorker = new Worker(
  'pushNotificationQueue',
  async (job) => {
    const { job_id, event, payload } = job.data;

    /**
     * Database (add when tbl_job migration + Job model exist):
     * const dbJob = await Job.findByPk(job_id);
     * if (dbJob) {
     *   await dbJob.update({
     *     status: 'PROCESSING',
     *     attempts: job.attemptsMade + 1,
     *     processed_at: new Date()
     *   });
     * }
     */

    switch (event) {
      case 'REGISTER':
        logger.info('Processing REGISTER push notification', { job_id, payload });
        break;

      case 'FORGOT_PASSWORD':
        logger.info('Processing FORGOT_PASSWORD push notification', { job_id, payload });
        break;

      case 'CHANGE_PASSWORD':
        logger.info('Processing CHANGE_PASSWORD push notification', { job_id, payload });
        break;

      case 'GENERAL':
        logger.info('Processing GENERAL push notification', { job_id, payload });
        break;

      default:
        throw new Error(`Unknown push notification event ${event}`);
    }

    /**
     * Database (add when tbl_job migration + Job model exist):
     * if (dbJob) {
     *   await dbJob.update({ status: 'COMPLETED', processed_at: new Date() });
     * }
     */

    return true;
  },
  {
    connection: redis,
    concurrency: 5
  }
);

pushNotificationWorker.on('completed', (job) => {
  logger.info('Push notification job completed', {
    bullmq_job_id: job.id,
    job_id: job.data?.job_id
  });
});

pushNotificationWorker.on('failed', async (job, error) => {
  logger.error('Push notification job failed', {
    bullmq_job_id: job?.id,
    job_id: job?.data?.job_id,
    message: error.message,
    stack: error.stack
  });

  if (!job?.data?.job_id) {
    return;
  }

  /**
   * Database (add when tbl_job migration + Job model exist):
   * const dbJob = await Job.findByPk(job.data.job_id);
   * if (dbJob) {
   *   await dbJob.update({
   *     status: 'FAILED',
   *     failed_reason: error.message,
   *     attempts: (job.attemptsMade || 0) + 1,
   *     processed_at: new Date()
   *   });
   * }
   */
});

pushNotificationWorker.on('error', (error) => {
  logger.error('Push notification worker error', {
    message: error.message,
    stack: error.stack
  });
});

module.exports = pushNotificationWorker;
