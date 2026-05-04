import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

export const signupSchema = authSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  username: z.string().min(3, 'Username must be at least 3 characters long.'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
});
