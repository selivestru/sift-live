import { Global, Module } from '@nestjs/common'

import { SocketGateway } from './socket.gateway'
import { SocketService } from './socket.service'
import { WsAuthMiddleware } from './ws-auth.middleware'

@Global()
@Module({
  providers: [SocketGateway, SocketService, WsAuthMiddleware],
  exports: [SocketService],
})
export class SocketModule {}
