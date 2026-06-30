import { useQuery } from 'urql'

import { graphql } from '~/shared/api/graphql'

export const STREAM_KEY_QUERY = graphql(`
  query StreamKey {
    streamKey {
      id
      streamKey
    }
  }
`)

export const useStreamKey = () => {
  const [{ data, fetching, error }] = useQuery({
    query: STREAM_KEY_QUERY,
  })

  return { streamKey: data?.streamKey.streamKey ?? null, fetching, error }
}
