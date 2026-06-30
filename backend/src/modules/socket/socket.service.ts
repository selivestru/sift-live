import { Injectable } from '@nestjs/common'

import { ChannelSubscribeDto } from './dto/channel-subscribe.dto'
import { MessageSendDto } from './dto/message-send.dto'
import { AppSocket } from './socket.types'
import { type Server } from 'socket.io'
import { RedisService } from '~/modules/redis/redis.service'
import { PrismaService } from '~/prisma/prisma.service'

const USER_SOCKETS_PREFIX = 'user'

@Injectable()
export class SocketService {
  private server?: Server

  constructor(
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService,
  ) {}

  setServer(server: Server): void {
    this.server = server
  }

  async userConnected(
    userId: string,
    socketId: string,
  ): Promise<{ count: number; isFirst: boolean }> {
    await this.redisService.sadd(this.userSocketsKey(userId), socketId)
    const count = await this.redisService.scard(this.userSocketsKey(userId))
    const isFirst = count === 1

    return { count, isFirst }
  }

  async cleanupChannelRooms(rooms: string[]): Promise<void> {
    for (const room of rooms) {
      if (room.startsWith('channel:')) {
        const channelId = room.slice('channel:'.length)
        await this.redisService.decrementViewerCount(channelId)
      }
    }
  }

  async userDisconnected(
    userId: string,
    socketId: string,
  ): Promise<{ count: number; isLast: boolean }> {
    await this.redisService.srem(this.userSocketsKey(userId), socketId)
    const count = await this.redisService.scard(this.userSocketsKey(userId))
    const isLast = count === 0

    return { count, isLast }
  }

  async channelSubscribe(socket: AppSocket, dto: ChannelSubscribeDto): Promise<void> {
    const channel = await this.prismaService.channel.findUnique({
      where: { id: dto.channelId },
      select: { id: true },
    })

    if (!channel) {
      return
    }

    socket.emit('channel:subscribed', { channelId: channel.id })

    await socket.join(`channel:${channel.id}`)
    await this.redisService.incrementViewerCount(channel.id)
  }

  async channelUnsubscribe(socket: AppSocket, dto: ChannelSubscribeDto): Promise<void> {
    socket.emit('channel:unsubscribed', { channelId: dto.channelId })

    await socket.leave(`channel:${dto.channelId}`)
    await this.redisService.decrementViewerCount(dto.channelId)
  }

  async messageSend(socket: AppSocket, dto: MessageSendDto): Promise<void> {
    const { sub: userId, username } = socket.data.user!

    const channel = await this.prismaService.channel.findUnique({
      where: {
        id: dto.channelId,
      },
      select: { id: true },
    })

    if (!channel) {
      return
    }

    const message = await this.prismaService.message.create({
      data: {
        userId,
        text: dto.text,
        channelId: channel.id,
      },
      include: {
        user: { select: { color: true } },
      },
    })

    const payload = {
      id: message.id,
      userId,
      text: dto.text,
      channelId: channel.id,
      username,
      color: message.user.color,
    }

    this.server?.to(`channel:${channel.id}`).emit('message:new', payload)
  }

  async emitUsersChannelOnline(channelId: string): Promise<void> {
    this.server?.to(`channel:${channelId}`).emit('channel:online', { channelId })

    const followers = await this.prismaService.channelFollow.findMany({
      where: { channelId },
      select: { followerId: true },
    })

    for (const follower of followers) {
      this.server?.to(`user:${follower.followerId}`).emit('channel:online', { channelId })
    }
  }

  async emitUsersChannelOffline(channelId: string): Promise<void> {
    this.server?.to(`channel:${channelId}`).emit('channel:offline', { channelId })

    const followers = await this.prismaService.channelFollow.findMany({
      where: { channelId },
      select: { followerId: true },
    })

    for (const follower of followers) {
      this.server?.to(`user:${follower.followerId}`).emit('channel:offline', { channelId })
    }
  }

  emitToUser(userId: string, event: string, payload: unknown): void {
    this.server?.to(`user:${userId}`).emit(event, payload)
  }

  private userSocketsKey(userId: string): string {
    return `${USER_SOCKETS_PREFIX}:${userId}:sockets`
  }
}
