import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { UserService } from '../user/user.service'
import { Channel } from './entities/channel.entity'
import { PrismaService } from '~/prisma/prisma.service'

@Injectable()
export class ChannelService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async findByUsername(username: string, currentUserId: string): Promise<Channel> {
    const user = await this.userService.findByUsername(username)

    if (!user) {
      throw new NotFoundException('Channel not found')
    }

    const channel = await this.prismaService.channel.findUnique({
      where: { userId: user.id },
      omit: { streamKey: true },
      include: { followers: { where: { followerId: currentUserId }, take: 1 } },
    })

    if (!channel) {
      throw new NotFoundException('Channel not found')
    }

    const { followers, ...channelData } = channel

    return {
      ...channelData,
      isFollowing: followers.length > 0,
    }
  }

  async getFollowedChannels(userId: string): Promise<Channel[]> {
    const channels = await this.prismaService.channel.findMany({
      where: {
        followers: {
          some: {
            followerId: userId,
          },
        },
      },
      include: { followers: { where: { followerId: userId }, take: 1 } },
      omit: { streamKey: true },
    })

    const transformedChannels = channels.map((channel) => {
      const { followers, ...channelData } = channel

      return {
        ...channelData,
        isFollowing: followers.length > 0,
      }
    })

    return transformedChannels
  }

  async getLiveChannels(): Promise<Channel[]> {
    const channels = await this.prismaService.channel.findMany({
      where: { isLive: true },
      omit: { streamKey: true },
      orderBy: { title: 'asc' },
      take: 10,
    })

    const transformedChannels = channels.map((channel) => ({
      ...channel,
      isFollowing: false,
    }))

    return transformedChannels
  }

  async followChannel(
    userId: string,
    channelId: string,
  ): Promise<{ id: string; isFollowing: boolean }> {
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

    await this.prismaService.channelFollow.create({
      data: { channelId, followerId: userId },
    })

    return {
      id: channelId,
      isFollowing: true,
    }
  }

  async unfollowChannel(
    userId: string,
    channelId: string,
  ): Promise<{ id: string; isFollowing: boolean }> {
    const follow = await this.prismaService.channelFollow.findUnique({
      where: { channelId_followerId: { channelId, followerId: userId } },
    })

    if (!follow) {
      throw new NotFoundException('Follow relationship not found')
    }

    await this.prismaService.channelFollow.delete({
      where: { channelId_followerId: { channelId, followerId: userId } },
    })

    return {
      id: channelId,
      isFollowing: false,
    }
  }
}
