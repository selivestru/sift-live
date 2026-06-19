import { useQuery } from 'urql'

import { FOLLOWED_CHANNELS_QUERY } from '~/features/channel/api/channel.queries'
import type { FollowedChannelsQuery } from '~/shared/api/graphql/__generated__/graphql'
import { useAuthStore } from '~/shared/auth'

export const useFollowedChannels = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [{ data, fetching, error }] = useQuery({
    query: FOLLOWED_CHANNELS_QUERY,
    pause: !isAuthenticated,
  })

  const { onlineChannels, offlineChannels } = (data?.followedChannels ?? []).reduce<{
    onlineChannels: FollowedChannelsQuery['followedChannels']
    offlineChannels: FollowedChannelsQuery['followedChannels']
  }>(
    (acc, channel) => {
      if (channel.isLive) {
        acc.onlineChannels.push(channel)
      } else {
        acc.offlineChannels.push(channel)
      }
      return acc
    },
    { onlineChannels: [], offlineChannels: [] },
  )

  return {
    data: { onlineChannels, offlineChannels },
    fetching,
    error,
  }
}
