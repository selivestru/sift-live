import { type INestApplicationContext } from '@nestjs/common'
import { type ConfigService } from '@nestjs/config'
import { IoAdapter } from '@nestjs/platform-socket.io'

import { type AppSocket } from './socket.types'
import { WsAuthMiddleware } from './ws-auth.middleware'
import { type Server, type ServerOptions } from 'socket.io'
import { type EnvConfig } from '~/config/env.config'

export class SocketIoAdapter extends IoAdapter {
  constructor(
    private readonly app: INestApplicationContext,
    private readonly configService: ConfigService<EnvConfig>,
  ) {
    super(app)
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: this.configService.getOrThrow<string>('ORIGIN'),
        credentials: true,
      },
      pingTimeout: 20_000,
      pingInterval: 25_000,
    }) as Server

    const authMiddleware = this.app.get(WsAuthMiddleware)

    server.use((socket: AppSocket, next) => {
      authMiddleware.verify(socket, next)
    })

    return server
  }
}
