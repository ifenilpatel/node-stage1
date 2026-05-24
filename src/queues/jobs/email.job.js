const { v4: uuidv4 } = require('uuid');

const db = require('../../../models/index');
const { Job } = db;

const { emailQueue } = require('../index');

const EMAIL_EVENTS = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD'
};

const addEmailJob = async ({ event, payload }) => {
  const customJobId = uuidv4();

  await Job.create({
    job_id: customJobId,
    queue_name: 'emailQueue',
    job_name: event,
    payload,
    status: 'PENDING',
    attempts: 0
  });

  await emailQueue.add(
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
  addEmailJob,
  EMAIL_EVENTS
};
