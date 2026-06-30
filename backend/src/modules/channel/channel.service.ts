import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { UserService } from '../user/user.service'
import { Channel } from './entities/channel.entity'
import { StreamKey } from './entities/stream-key.entity'
import { Category, Channel as ChannelPrisma } from '~/generated/prisma/client'
import { RedisService } from '~/modules/redis/redis.service'
import { PrismaService } from '~/prisma/prisma.service'

@Injectable()
export class ChannelService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  async findByUsername(username: string, currentUserId?: string): Promise<Channel> {
    const user = await this.userService.findByUsername(username)

    if (!user) {
      throw new NotFoundException('Channel not found')
    }

    const channel = await this.prismaService.channel.findUnique({
      where: { userId: user.id },
      omit: { streamKey: true },
      include: {
        category: true,
        followers: {
          where: {
            followerId: currentUserId,
          },
          take: 1,
        },
      },
    })

    if (!channel) {
      throw new NotFoundException('Channel not found')
    }

    const { followers, category, ...channelData } = channel

    return {
      ...channelData,
      category,
      username: user.username,
      isFollowing: currentUserId ? followers.length > 0 : false,
      viewerCount: channel.isLive ? await this.redisService.getViewerCount(channel.id) : 0,
    }
  }

  async getFollowedChannels(userId: string): Promise<Channel[]> {
    const channels = await this.prismaService.channel.findMany({
      where: {
        userId: {
          not: userId,
        },
        followers: {
          some: {
            followerId: userId,
          },
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        category: true,
        followers: {
          where: {
            followerId: userId,
          },
          take: 1,
        },
      },
      omit: { streamKey: true },
    })

    const transformedChannels = await Promise.all(
      channels.map(async (channel) => {
        const { followers, user, category, ...channelData } = channel

        return {
          ...channelData,
          category,
          username: user.username,
          isFollowing: followers.length > 0,
          viewerCount: channel.isLive ? await this.redisService.getViewerCount(channel.id) : 0,
        }
      }),
    )

    return transformedChannels
  }

  async getLiveChannels(userId?: string): Promise<Channel[]> {
    const channels = await this.prismaService.channel.findMany({
      where: {
        isLive: true,
        ...(userId && {
          userId: { not: userId },
          followers: { none: { followerId: userId } },
        }),
      },
      omit: { streamKey: true },
      orderBy: { title: 'asc' },
      take: 10,
      include: {
        user: {
          select: {
            username: true,
          },
        },
        category: true,
      },
    })

    const transformedChannels = await Promise.all(
      channels.map(async ({ user, category, ...channel }) => ({
        ...channel,
        category,
        username: user.username,
        isFollowing: false,
        viewerCount: channel.isLive ? await this.redisService.getViewerCount(channel.id) : 0,
      })),
    )

    return transformedChannels
  }

  async followChannel(userId: string, channelId: string): Promise<Channel> {
    const channel = await this.prismaService.channel.findUnique({
      where: { id: channelId },
      include: { followers: { where: { followerId: userId }, take: 1 } },
    })

    if (!channel) {
      throw new NotFoundException('Channel not found')
    }

    const isFollowing = channel.followers.length > 0

    if (isFollowing) {
      throw new ConflictException('Already following channel')
    }

    if (channel.userId === userId) {
      throw new ConflictException('Cannot follow your own channel')
    }

    const { channel: updatedChannel } = await this.prismaService.channelFollow.create({
      data: { channelId, followerId: userId },
      include: {
        channel: {
          include: {
            user: {
              select: { username: true },
            },
            category: true,
          },
        },
      },
    })

    return this.toChannelEntity(updatedChannel, true)
  }

  async unFollowChannel(userId: string, channelId: string): Promise<Channel> {
    const follow = await this.prismaService.channelFollow.findUnique({
      where: { channelId_followerId: { channelId, followerId: userId } },
    })

    if (!follow) {
      throw new NotFoundException('Follow relationship not found')
    }

    const { channel: updatedChannel } = await this.prismaService.channelFollow.delete({
      where: { channelId_followerId: { channelId, followerId: userId } },
      include: {
        channel: {
          include: {
            user: {
              select: { username: true },
            },
            category: true,
          },
        },
      },
    })

    return this.toChannelEntity(updatedChannel, false)
  }

  async updateCategory(channelId: string, newCategoryId: string): Promise<Channel> {
    const channel = await this.prismaService.channel.findUnique({
      where: { id: channelId },
      include: { user: { select: { username: true } }, category: true },
    })

    if (!channel) {
      throw new NotFoundException('Channel not found')
    }

    const newCategory = await this.prismaService.category.findUnique({
      where: { id: newCategoryId },
    })

    if (!newCategory) {
      throw new NotFoundException('Category not found')
    }

    if (channel.categoryId === newCategoryId) {
      return this.toChannelEntity(channel, false)
    }

    if (channel.isLive) {
      await this.rotateStreamCategoryLog(channel.id, newCategoryId, newCategory.title)
    }

    const updatedChannel = await this.prismaService.channel.update({
      where: { id: channelId },
      data: { categoryId: newCategoryId },
      include: { user: { select: { username: true } }, category: true },
    })

    return this.toChannelEntity(updatedChannel, false)
  }

  async getStreamKey(userId: string): Promise<StreamKey> {
    const channel = await this.prismaService.channel.findUnique({
      where: { userId },
    })

    if (!channel) {
      throw new NotFoundException('Channel not found')
    }

    return {
      id: channel.id,
      streamKey: channel.streamKey,
    }
  }

  async resetStreamKey(userId: string): Promise<StreamKey> {
    const channel = await this.prismaService.channel.findUnique({
      where: { userId },
    })

    if (!channel) {
      throw new NotFoundException('Channel not found')
    }

    const newStreamKey = this.userService.generateStreamKey()

    await this.prismaService.channel.update({
      where: { id: channel.id },
      data: { streamKey: newStreamKey },
    })

    return {
      id: channel.id,
      streamKey: newStreamKey,
    }
  }

  private async rotateStreamCategoryLog(
    channelId: string,
    newCategoryId: string,
    newCategoryName: string,
  ): Promise<void> {
    const activeStream = await this.prismaService.stream.findFirst({
      where: { channelId, endedAt: null },
      orderBy: { startedAt: 'desc' },
    })

    if (!activeStream) return

    const now = new Date()

    const lastLog = await this.prismaService.streamCategoryLog.findFirst({
      where: { streamId: activeStream.id, endedAt: null },
    })

    if (lastLog) {
      const duration = Math.round((now.getTime() - lastLog.startedAt.getTime()) / 1000)
      await this.prismaService.streamCategoryLog.update({
        where: { id: lastLog.id },
        data: { endedAt: now, duration },
      })
    }

    await this.prismaService.streamCategoryLog.create({
      data: {
        streamId: activeStream.id,
        categoryId: newCategoryId,
        categoryName: newCategoryName,
      },
    })
  }

  private async toChannelEntity(
    channel: ChannelPrisma & { user: { username: string }; category: Category },
    isFollowing: boolean,
  ): Promise<Channel> {
    const { user, ...rest } = channel

    return {
      ...rest,
      username: user.username,
      isFollowing,
      viewerCount: channel.isLive ? await this.redisService.getViewerCount(channel.id) : 0,
    }
  }
}
