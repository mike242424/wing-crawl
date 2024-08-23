import z from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, {
    message: 'Please enter a valid name.',
  }),
});
