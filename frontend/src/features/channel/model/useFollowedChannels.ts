import { useEffect } from 'react'
import { useQuery } from 'urql'

import type { FollowedChannelsQuery } from '~/shared/api/graphql/__generated__/graphql'
import { useAuthStore } from '~/shared/auth'

import { FOLLOWED_CHANNELS_QUERY } from '../api/channel.queries'

export const useFollowedChannels = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: FOLLOWED_CHANNELS_QUERY,
    requestPolicy: 'network-only',
    pause: true,
  })

  useEffect(() => {
    if (isAuthenticated) {
      // executeQuery() // TODO: uncomment
    }
  }, [isAuthenticated, executeQuery])

  useEffect(() => {
    const intervalId = setInterval(() => {
      executeQuery()
    }, 15_000)

    return () => clearInterval(intervalId)
  }, [executeQuery])

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
    fetching,
    error,
  }
}
