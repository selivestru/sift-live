import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import type { EnvConfig } from './config/env.config'
import { SocketIoAdapter } from './modules/socket/socket-io.adapter'
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

  app.useWebSocketAdapter(new SocketIoAdapter(app, configService))

  const port = configService.getOrThrow<string>('PORT')

  await app.listen(port, '0.0.0.0')
}

void bootstrap()
