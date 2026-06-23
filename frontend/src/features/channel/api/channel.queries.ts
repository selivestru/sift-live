import { graphql } from '~/shared/api/graphql'

export const FOLLOWED_CHANNELS_QUERY = graphql(`
  query FollowedChannels {
    followedChannels {
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

export const LIVE_CHANNELS_QUERY = graphql(`
  query LiveChannels {
    liveChannels {
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
