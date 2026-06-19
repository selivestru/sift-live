import { useQuery } from 'urql'

import { LIVE_CHANNELS_QUERY } from '~/features/channel/api/channel.queries'

export const useActiveChannels = () => {
  const [{ data, fetching, error }] = useQuery({
    query: LIVE_CHANNELS_QUERY,
  })

  return {
    data: data?.liveChannels ?? [],
    fetching,
    error,
  }
}
