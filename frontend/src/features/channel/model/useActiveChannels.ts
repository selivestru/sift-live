import { useEffect } from 'react'
import { useQuery } from 'urql'

import { LIVE_CHANNELS_QUERY } from '../api/channel.queries'

export const useActiveChannels = () => {
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: LIVE_CHANNELS_QUERY,
    requestPolicy: 'network-only',
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      executeQuery()
    }, 15_000)

    return () => clearInterval(intervalId)
  }, [executeQuery])

  return {
    data: data?.liveChannels,
    fetching,
    error,
  }
}
