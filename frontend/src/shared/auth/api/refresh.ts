import { graphql } from '~/shared/api/graphql'

export const REFRESH_MUTATION = graphql(`
  mutation Refresh {
    refresh {
      accessToken
    }
  }
`)
