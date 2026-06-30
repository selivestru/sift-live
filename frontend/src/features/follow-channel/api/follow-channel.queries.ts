import { graphql } from '~/shared/api/graphql'

export const FOLLOW_CHANNEL_MUTATION = graphql(`
  mutation FollowChannel($channelId: String!) {
    followChannel(channelId: $channelId) {
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
      viewerCount
    }
  }
`)

export const UNFOLLOW_CHANNEL_MUTATION = graphql(`
  mutation UnFollowChannel($channelId: String!) {
    unFollowChannel(channelId: $channelId) {
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
      viewerCount
    }
  }
`)
