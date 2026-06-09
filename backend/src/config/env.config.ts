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
  const env = envSchema.parse(process.env)

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    origin: env.ORIGIN,

    databaseUrl: env.DATABASE_URL,
    redisUrl: env.REDIS_URL,

    cookieSecret: env.COOKIE_SECRET,

    jwtAccessSecret: env.JWT_ACCESS_SECRET,
    jwtAccessTtl: ms(env.JWT_ACCESS_TTL as StringValue),
    jwtRefreshTtl: ms(env.JWT_REFRESH_TTL as StringValue),
  }
})
