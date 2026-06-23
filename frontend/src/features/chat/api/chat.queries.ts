import { graphql } from '~/shared/api/graphql'

export const CHANNEL_QUERY = graphql(`
  query Channel($username: String!) {
    channel(username: $username) {
      id
      username
      title
      category {
        id
        title
        slug
        image
      }
      tags
      isLive
      userId
      isFollowing
    }
  }
`)
