import { useQuery } from '@apollo/client/react'

import type { FollowedChannelsQuery } from '~/shared/api/graphql'
import { useAuthStore } from '~/shared/auth'

import { FOLLOWED_CHANNELS_QUERY } from '../api/channel.queries'

export const useFollowedChannels = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const { data, loading, error } = useQuery(FOLLOWED_CHANNELS_QUERY, {
    fetchPolicy: 'network-only',
    skip: !isAuthenticated,
  })

  const transformedData = data?.followedChannels?.reduce<{
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
    data: transformedData,
    fetching: loading,
    error,
  }
}
