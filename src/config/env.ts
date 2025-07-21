import { z } from 'zod/mini';

const envSchema = z.object({
  COGNITO_CLIENT_ID: z.string().check(z.minLength(1)),
  COGNITO_CLIENT_SECRET: z.string().check(z.minLength(1)),
  COGNITO_USER_POOL_ID: z.string().check(z.minLength(1)),
});

export const env = envSchema.parse(process.env);
