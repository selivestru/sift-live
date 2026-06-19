import { graphql } from '~/shared/api/graphql'

export const CHANNEL_QUERY = graphql(`
  query Channel($username: String!) {
    channel(username: $username) {
      id
      title
      category
      tags
      isLive
      userId
      isFollowing
    }
  }
`)
