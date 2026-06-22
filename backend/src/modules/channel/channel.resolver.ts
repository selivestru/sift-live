import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ChannelService } from './channel.service'
import { Channel } from './entities/channel.entity'
import { OptionalAuthGuard } from '~/common/decorators/optional-auth.guard'
import { Public } from '~/common/decorators/public.decorator'

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Public()
  @UseGuards(OptionalAuthGuard)
  @Query(() => Channel)
  channel(@Args('username') username: string, @CurrentUser('sub') currentUserId?: string) {
    return this.channelService.findByUsername(username, currentUserId)
  }

  @Query(() => [Channel])
  followedChannels(@CurrentUser('sub') userId: string) {
    return this.channelService.getFollowedChannels(userId)
  }

  @Public()
  @Query(() => [Channel])
  liveChannels() {
    return this.channelService.getLiveChannels()
  }

  @Mutation(() => Channel)
  followChannel(@CurrentUser('sub') userId: string, @Args('channelId') channelId: string) {
    return this.channelService.followChannel(userId, channelId)
  }

  @Mutation(() => Channel)
  unFollowChannel(@CurrentUser('sub') userId: string, @Args('channelId') channelId: string) {
    return this.channelService.unFollowChannel(userId, channelId)
  }
}
