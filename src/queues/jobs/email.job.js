const { emailQueue } = require('../index');

const EMAIL_EVENTS = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD'
};

const addEmailJob = async ({ event, payload }) => {
  await emailQueue.add(
    event,
    { event, payload },
    {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
      removeOnComplete: true,
      removeOnFail: false
    }
  );
};

module.exports = {
  addEmailJob,
  EMAIL_EVENTS
};
