import { HeartIcon } from 'lucide-react'
import { useIntlayer } from 'react-intlayer'

import { useFollowChannel } from '~/features/follow-channel/model/useFollowChannel'
import { Button } from '~/shared/ui/Button'

interface FollowButtonProps {
  channelId: string
  isFollowing: boolean
}

export const FollowButton = ({ channelId, isFollowing }: FollowButtonProps) => {
  const t = useIntlayer('channel-page')

  const { fetching, toggleFollow } = useFollowChannel({ channelId, isFollowing })

  return (
    <Button
      variant={isFollowing ? 'secondary' : 'default'}
      size="default"
      isLoading={fetching}
      onClick={toggleFollow}
      aria-pressed={isFollowing}
    >
      {!fetching && <HeartIcon fill={isFollowing ? 'currentColor' : 'none'} />}
      {isFollowing ? t.following.value : t.follow.value}
    </Button>
  )
}
