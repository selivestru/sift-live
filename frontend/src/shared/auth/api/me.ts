import { graphql } from '~/shared/api/graphql'

export const ME_QUERY = graphql(`
  query Me {
    me {
      id
      email
      username
      color
    }
  }
`)
