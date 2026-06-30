import { useQuery } from '@apollo/client/react'

import { LIVE_CHANNELS_QUERY } from '../api/channel.queries'

export const useActiveChannels = () => {
  const { data, loading, error } = useQuery(LIVE_CHANNELS_QUERY, {
    fetchPolicy: 'network-only',
  })

  return {
    data: data?.liveChannels,
    fetching: loading,
    error,
  }
}
