const { z } = require('zod');

const page_index = z.coerce
  .number({ required_error: 'Page index is required' })
  .min(1, 'Page index must be greater than 0');

const page_size = z.coerce
  .number({ required_error: 'Page size is required' })
  .min(0, 'Page size cannot be negative')
  .max(100, 'Page size cannot exceed 100');

const token = z.string({ required_error: 'Token is required' }).trim().min(1, 'Invalid token');

const new_password = z
  .string({ required_error: 'New password is required' })
  .min(6, 'New password must be at least 6 characters');

const confirm_password = z
  .string({ required_error: 'Confirm password is required' })
  .min(6, 'Confirm password must be at least 6 characters');

const passwordValidation = z
  .object({ new_password, confirm_password })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'New password and confirm password must match',
    path: ['confirm_password']
  });

module.exports = {
  page_index,
  page_size,
  token,
  new_password,
  confirm_password,
  passwordValidation
};
