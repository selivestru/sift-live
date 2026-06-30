import { useQuery } from '@apollo/client/react'

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
  const { data, loading, error } = useQuery(STREAM_KEY_QUERY)

  return { streamKey: data?.streamKey.streamKey ?? null, fetching: loading, error }
}
