import { z } from 'zod';

export const registerSchema = z.object({
  fullname: z.string().trim().min(3, 'Full name must be at least 3 characters'),

  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),

  password: z.string().min(6, 'Password must be at least 6 characters'),

  contact: z
    .string()
    .trim()
    .min(10, 'Invalid contact number')
    .max(15, 'Invalid contact number')
    .optional(),

  picture: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),

  password: z.string().min(6, 'Password must be at least 6 characters')
});
