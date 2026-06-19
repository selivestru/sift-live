import { useIntlayer } from 'react-intlayer'
import { toast } from 'sonner'
import { useMutation } from 'urql'

import {
  FOLLOW_CHANNEL_MUTATION,
  UNFOLLOW_CHANNEL_MUTATION,
} from '~/features/follow-channel/api/follow-channel.queries'
import { useAuthDialog, useAuthStore } from '~/shared/auth'

interface UseFollowChannelArgs {
  channelId: string
  isFollowing: boolean
}

export const useFollowChannel = ({ channelId, isFollowing }: UseFollowChannelArgs) => {
  const t = useIntlayer('channel-page')
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const openAuthDialog = useAuthDialog((s) => s.open)

  const [{ fetching: followFetching }, executeFollow] = useMutation(FOLLOW_CHANNEL_MUTATION)
  const [{ fetching: unfollowFetching }, executeUnfollow] = useMutation(UNFOLLOW_CHANNEL_MUTATION)

  const toggleFollow = async () => {
    if (!isAuthenticated) {
      openAuthDialog('login')
      return
    }

    const next = !isFollowing

    try {
      await (next ? executeFollow : executeUnfollow)({ channelId })
    } catch {
      toast.error(next ? t.followError.value : t.unfollowError.value)
    }
  }

  return {
    isFollowing,
    fetching: followFetching || unfollowFetching,
    toggleFollow,
  }
}
