import { useQuery } from '@apollo/client/react'

import { CHANNEL_QUERY } from '~/features/chat'

export const useChannel = (username: string) => {
  const { data, loading, error } = useQuery(CHANNEL_QUERY, {
    fetchPolicy: 'network-only',
    variables: { username },
  })

  return { data: data?.channel, fetching: loading, error }
}
