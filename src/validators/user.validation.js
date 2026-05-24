const { z } = require('zod');

const { page_index, page_size } = require('./common.validation');

const user_id = z.string().uuid('Invalid user id');

const first_name = z
  .string({ required_error: 'First name is required' })
  .trim()
  .min(2, 'First name must be at least 2 characters')
  .regex(/^[A-Za-z0-9 _-]+$/, 'First name can only contain letters, numbers, spaces, -, and _');

const selectionSchema = z.object({ page_index, page_size });

const selectByIdSchema = z.object({ user_id });

const selectAllSchema = z.object({ page_index, page_size });

const insertSchema = z.object({ first_name });

const updateSchema = z.object({ user_id, first_name });

const toggleSchema = z.object({ user_id });

module.exports = {
  selectionSchema,
  selectByIdSchema,
  selectAllSchema,
  insertSchema,
  updateSchema,
  toggleSchema
};
