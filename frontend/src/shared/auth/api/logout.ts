import { graphql } from '~/shared/api/graphql'

export const LOGOUT_MUTATION = graphql(`
  mutation Logout {
    logout
  }
`)
