import { Injectable } from '@nestjs/common'

import { ChannelSubscribeDto } from './dto/channel-subscribe.dto'
import { MessageSendDto } from './dto/message-send.dto'
import { AppSocket } from './socket.types'
import { type Server } from 'socket.io'
import { RedisService } from '~/modules/redis/redis.service'
import { PrismaService } from '~/prisma/prisma.service'

const USER_SOCKETS_PREFIX = 'user'
const PRESENCE_STATUS_KEY = 'presence:status'
const PRESENCE_LASTSEEN_KEY = 'presence:lastseen'

const ONLINE = 'online'
const OFFLINE = 'offline'

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

    if (isFirst) {
      await this.redisService.hset(PRESENCE_STATUS_KEY, userId, ONLINE)
    }

    return { count, isFirst }
  }

  async cleanupChannelRooms(socket: AppSocket): Promise<void> {
    for (const room of socket.rooms) {
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

    if (isLast) {
      await this.redisService.hset(PRESENCE_STATUS_KEY, userId, OFFLINE)
      await this.redisService.hset(PRESENCE_LASTSEEN_KEY, userId, Date.now().toString())
    }

    return { count, isLast }
  }

  async getUserSocketCount(userId: string): Promise<number> {
    return this.redisService.scard(this.userSocketsKey(userId))
  }

  async getUserStatus(userId: string): Promise<string | null> {
    return this.redisService.hget(PRESENCE_STATUS_KEY, userId)
  }

  async getUserLastSeen(userId: string): Promise<string | null> {
    return this.redisService.hget(PRESENCE_LASTSEEN_KEY, userId)
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

  emitToUser(userId: string, event: string, payload: unknown): void {
    this.server?.to(`user:${userId}`).emit(event, payload)
  }

  private userSocketsKey(userId: string): string {
    return `${USER_SOCKETS_PREFIX}:${userId}:sockets`
  }
}
