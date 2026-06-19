import { Injectable } from '@nestjs/common'

import { type Server } from 'socket.io'
import { RedisService } from '~/modules/redis/redis.service'

const USER_SOCKETS_PREFIX = 'user'
const PRESENCE_STATUS_KEY = 'presence:status'
const PRESENCE_LASTSEEN_KEY = 'presence:lastseen'

const ONLINE = 'online'
const OFFLINE = 'offline'

@Injectable()
export class SocketService {
  private server?: Server

  constructor(private readonly redisService: RedisService) {}

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

  emitToUser(userId: string, event: string, payload: unknown): void {
    this.server?.to(`user:${userId}`).emit(event, payload)
  }

  private userSocketsKey(userId: string): string {
    return `${USER_SOCKETS_PREFIX}:${userId}:sockets`
  }
}
