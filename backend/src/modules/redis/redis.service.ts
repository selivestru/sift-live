import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import Redis from 'ioredis'
import { EnvConfig } from '~/config/env.config'

const VIEWER_COUNT_PREFIX = 'viewercount'

@Injectable()
export class RedisService extends Redis {
  constructor(configService: ConfigService<EnvConfig>) {
    super(configService.getOrThrow<string>('REDIS_URL'))
  }

  async incrementViewerCount(channelId: string): Promise<number> {
    const count = await this.incr(this.viewerCountKey(channelId))
    await this.expire(this.viewerCountKey(channelId), 60 * 60 * 24)
    return count
  }

  async decrementViewerCount(channelId: string): Promise<number> {
    const key = this.viewerCountKey(channelId)
    const count = await this.decr(key)

    if (count <= 0) {
      await this.del(key)
      return 0
    }

    return count
  }

  async getViewerCount(channelId: string): Promise<number> {
    const value = await this.get(this.viewerCountKey(channelId))
    return value ? Number.parseInt(value, 10) : 0
  }

  private viewerCountKey(channelId: string): string {
    return `${VIEWER_COUNT_PREFIX}:${channelId}`
  }
}
