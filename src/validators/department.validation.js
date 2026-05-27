const { z } = require('zod');

const { page_index, page_size } = require('./common.validation');

const department_id = z.string().uuid('Invalid department id');

const code = z
  .string({ required_error: 'Code is required' })
  .trim()
  .toUpperCase()
  .length(6, 'Code must be exactly 6 characters')
  .regex(/^[A-Z0-9]+$/, 'Code can only contain uppercase letters and numbers');

const title = z
  .string({ required_error: 'Title is required' })
  .trim()
  .min(2, 'Title must be at least 2 characters')
  .regex(/^[A-Za-z0-9 _-]+$/, 'Title can only contain letters, numbers, spaces, -, and _');

const is_active = z.boolean().default(true);

const selectionSchema = z.object({ page_index, page_size });

const selectByIdSchema = z.object({ department_id });

const selectAllSchema = z.object({ page_index, page_size });

const insertSchema = z.object({ code, title, is_active });

const updateSchema = z.object({ department_id, code, title, is_active });

const toggleSchema = z.object({ department_id });

module.exports = {
  selectionSchema,
  selectByIdSchema,
  selectAllSchema,
  insertSchema,
  updateSchema,
  toggleSchema
};
