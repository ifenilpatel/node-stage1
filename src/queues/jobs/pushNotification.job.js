const { v4: uuidv4 } = require('uuid');

const { pushNotificationQueue } = require('../index');

const PUSH_NOTIFICATION_EVENTS = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  GENERAL: 'GENERAL'
};

const addPushNotificationJob = async ({ event, payload }) => {
  const customJobId = uuidv4();

  /**
   * Database (add when tbl_job migration + Job model exist):
   * await Job.create({
   *   job_id: customJobId,
   *   queue_name: 'pushNotificationQueue',
   *   job_name: event,
   *   payload,
   *   status: 'PENDING',
   *   attempts: 0
   * });
   */

  await pushNotificationQueue.add(
    event,
    { job_id: customJobId, event, payload },
    {
      jobId: customJobId,
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
      removeOnComplete: true,
      removeOnFail: false
    }
  );

  return { job_id: customJobId };
};

module.exports = {
  addPushNotificationJob,
  PUSH_NOTIFICATION_EVENTS
};
