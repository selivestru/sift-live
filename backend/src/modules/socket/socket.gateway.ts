import { Logger } from '@nestjs/common'
import {
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  type OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'

import { SocketService } from './socket.service'
import { type AppSocket } from './socket.types'
import { type Server } from 'socket.io'

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(SocketGateway.name)

  @WebSocketServer()
  private server!: Server

  constructor(private readonly socketService: SocketService) {}

  afterInit(): void {
    this.socketService.setServer(this.server)
  }

  async handleConnection(client: AppSocket): Promise<void> {
    const user = client.data.user

    client.emit('auth:connected')

    if (user) {
      const { isFirst } = await this.socketService.userConnected(user.sub, client.id)

      await client.join(`user:${user.sub}`)

      this.logger.log(
        `auth user ${user.sub} connected (socket ${client.id})${isFirst ? ' [first]' : ''}`,
      )
    } else {
      this.logger.log(`anonymous ${client.data.anonymousId} connected (socket ${client.id})`)
    }
  }

  async handleDisconnect(client: AppSocket): Promise<void> {
    const user = client.data.user

    if (user) {
      const { isLast } = await this.socketService.userDisconnected(user.sub, client.id)

      this.logger.log(
        `auth user ${user.sub} disconnected (socket ${client.id})${isLast ? ' [last]' : ''}`,
      )
    }
  }
}
