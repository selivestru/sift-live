import { useQuery } from 'urql'

import { CHANNEL_QUERY } from '~/features/chat'

export const useChannel = (username: string) => {
  const [{ data, fetching, error }] = useQuery({
    query: CHANNEL_QUERY,
    requestPolicy: 'network-only',
    variables: { username },
  })

  return { data: data?.channel, fetching, error }
}
