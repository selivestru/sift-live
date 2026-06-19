import { FollowButton } from '~/features/follow-channel'
import type { ChannelQuery } from '~/shared/api/graphql/__generated__/graphql'
import { useAuthStore } from '~/shared/auth'
import { Avatar, AvatarFallback } from '~/shared/ui/Avatar'
import { Badge } from '~/shared/ui/Badge'

const initialsOf = (username: string) => username.slice(0, 2).toUpperCase()

interface ChannelHeaderProps {
  username: string
  channel: ChannelQuery['channel']
}

export const ChannelHeader = ({ username, channel }: ChannelHeaderProps) => {
  const user = useAuthStore((s) => s.user)
  const isOwnChannel = user?.id === channel.userId

  return (
    <header className="flex flex-wrap items-center gap-3">
      <Avatar size="lg" className="size-12 shrink-0">
        <AvatarFallback className="text-base">{initialsOf(username)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-end justify-between gap-2">
          <h1 className="truncate text-lg font-semibold">{username}</h1>
          {!isOwnChannel && (
            <FollowButton channelId={channel.id} isFollowing={channel.isFollowing} />
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground truncate text-sm">{channel.title}</p>
          {channel.isLive && (
            <span className="text-destructive flex items-center gap-1 text-xs">
              <span className="bg-destructive inline-block size-1.5 animate-pulse rounded-full" />
              LIVE
            </span>
          )}
        </div>
        {channel.category && <Badge variant="secondary">{channel.category}</Badge>}
      </div>
    </header>
  )
}
