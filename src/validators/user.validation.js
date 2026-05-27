const { z } = require('zod');

const { page_index, page_size } = require('./common.validation');

const user_id = z.string().uuid('Invalid user id');

const first_name = z
  .string({ required_error: 'First name is required' })
  .trim()
  .min(2, 'First name must be at least 2 characters')
  .regex(/^[A-Za-z0-9 _-]+$/, 'First name can only contain letters, numbers, spaces, -, and _');

const email = z
  .string({ required_error: 'Email is required' })
  .trim()
  .toLowerCase()
  .email('Invalid email address');

const password = z.string({ required_error: 'Password is required' });

const is_active = z.boolean().default(true);

const selectionSchema = z.object({ page_index, page_size });

const selectByIdSchema = z.object({ user_id });

const selectAllSchema = z.object({ page_index, page_size });

const insertSchema = z.object({
  first_name,
  email,
  password,
  is_active
});

const updateSchema = z.object({
  user_id,
  first_name,
  email,
  password,
  is_active
});

const toggleSchema = z.object({ user_id });

module.exports = {
  selectionSchema,
  selectByIdSchema,
  selectAllSchema,
  insertSchema,
  updateSchema,
  toggleSchema
};
