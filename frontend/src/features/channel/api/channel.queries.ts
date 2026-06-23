import { graphql } from '~/shared/api/graphql'

export const FOLLOWED_CHANNELS_QUERY = graphql(`
  query FollowedChannels {
    followedChannels {
      id
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
      username
    }
  }
`)

export const LIVE_CHANNELS_QUERY = graphql(`
  query LiveChannels {
    liveChannels {
      id
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
      username
    }
  }
`)
