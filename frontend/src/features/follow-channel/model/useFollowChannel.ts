import { useMutation } from '@apollo/client/react'
import { useIntlayer } from 'react-intlayer'
import { toast } from 'sonner'

import {
  FOLLOWED_CHANNELS_QUERY,
  LIVE_CHANNELS_QUERY,
} from '~/features/channel/api/channel.queries'
import { useAuthDialog, useAuthStore } from '~/shared/auth'

import { FOLLOW_CHANNEL_MUTATION, UNFOLLOW_CHANNEL_MUTATION } from '../api/follow-channel.queries'

interface UseFollowChannelArgs {
  channelId: string
  isFollowing: boolean
}

export const useFollowChannel = ({ channelId, isFollowing }: UseFollowChannelArgs) => {
  const t = useIntlayer('channel-page')
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const openAuthDialog = useAuthDialog((s) => s.open)

  const [executeFollow, { loading: followFetching }] = useMutation(FOLLOW_CHANNEL_MUTATION, {
    update: (cache, { data }) => {
      if (!data?.followChannel) return

      const followedData = cache.readQuery({ query: FOLLOWED_CHANNELS_QUERY })

      if (followedData) {
        const alreadyExists = followedData.followedChannels.some(
          (c) => c.id === data.followChannel.id,
        )

        if (!alreadyExists) {
          cache.writeQuery({
            query: FOLLOWED_CHANNELS_QUERY,
            data: {
              ...followedData,
              followedChannels: [...followedData.followedChannels, data.followChannel],
            },
          })
        }
      }

      const liveData = cache.readQuery({ query: LIVE_CHANNELS_QUERY })

      if (liveData) {
        cache.writeQuery({
          query: LIVE_CHANNELS_QUERY,
          data: {
            ...liveData,
            liveChannels: liveData.liveChannels.filter((c) => c.id !== data.followChannel.id),
          },
        })
      }
    },
  })

  const [executeUnfollow, { loading: unfollowFetching }] = useMutation(UNFOLLOW_CHANNEL_MUTATION, {
    update: (cache, { data }) => {
      if (!data?.unFollowChannel) return

      const followedData = cache.readQuery({ query: FOLLOWED_CHANNELS_QUERY })

      if (followedData) {
        cache.writeQuery({
          query: FOLLOWED_CHANNELS_QUERY,
          data: {
            ...followedData,
            followedChannels: followedData.followedChannels.filter(
              (c) => c.id !== data.unFollowChannel.id,
            ),
          },
        })
      }

      const liveData = cache.readQuery({ query: LIVE_CHANNELS_QUERY })

      if (liveData) {
        cache.writeQuery({
          query: LIVE_CHANNELS_QUERY,
          data: {
            ...liveData,
            liveChannels: [data.unFollowChannel, ...liveData.liveChannels],
          },
        })
      }
    },
  })

  const toggleFollow = async () => {
    if (!isAuthenticated) {
      openAuthDialog('login')
      return
    }

    const next = !isFollowing

    try {
      await (next ? executeFollow : executeUnfollow)({ variables: { channelId } })
    } catch {
      toast.error(next ? t.followError.value : t.unfollowError.value)
    }
  }

  return {
    isFollowing,
    fetching: followFetching || unfollowFetching,
    toggleFollow,
  }
}
