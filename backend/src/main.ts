import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { EnvConfig } from './config/env.config'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService<EnvConfig>)

  app.enableCors({
    origin: configService.getOrThrow<string>('ORIGIN'),
    credentials: true,
  })

  const cookieSecret = configService.getOrThrow<string>('COOKIE_SECRET')

  app.use(cookieParser(cookieSecret))

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  const port = configService.getOrThrow<string>('PORT')

  await app.listen(port, () => {
    Logger.log(`Server running on http://localhost:${port}`)
  })
}

void bootstrap()
