import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32, 'minimal 32 karakter'),
  ACCESS_TOKEN_SECONDS: z.coerce.number().default(900),
  REFRESH_TOKEN_DAYS: z.coerce.number().default(7),
  CLIENT_URL: z.string().default('http://localhost:3000'),
});

export const env = schema.parse(process.env);
export const isProd = env.NODE_ENV === 'production';
