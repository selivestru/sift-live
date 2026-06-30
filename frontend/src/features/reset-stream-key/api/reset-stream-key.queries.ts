import { graphql } from '~/shared/api/graphql'

export const RESET_STREAM_KEY_MUTATION = graphql(`
  mutation ResetStreamKey {
    resetStreamKey {
      id
      streamKey
    }
  }
`)
