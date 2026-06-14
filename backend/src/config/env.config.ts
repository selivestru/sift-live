import { registerAs } from '@nestjs/config'

import ms, { StringValue } from 'ms'
import { z } from 'zod'

const ttlSchema = z.string().refine(
  (value) => {
    const result = ms(value as StringValue)
    return typeof result === 'number' && result > 0
  },
  {
    message: 'Invalid TTL format',
  },
)

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number(),
  ORIGIN: z.url(),

  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),

  COOKIE_SECRET: z.string(),

  JWT_ACCESS_SECRET: z.string(),
  JWT_ACCESS_TTL: ttlSchema,

  JWT_REFRESH_TTL: ttlSchema,
})

export type EnvConfig = z.infer<typeof envSchema>

export default registerAs('app', () => {
  envSchema.parse(process.env)

  return {}
})
