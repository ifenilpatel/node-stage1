const { z } = require('zod');

const first_name = z
  .string({ required_error: 'First name is required' })
  .trim()
  .min(2, 'First name must be at least 2 characters')
  .regex(/^[A-Za-z0-9 _-]+$/, 'First name can only contain letters, numbers, spaces, -, and _');

const signInSchema = z.object({
  first_name
});

module.exports = {
  signInSchema
};
