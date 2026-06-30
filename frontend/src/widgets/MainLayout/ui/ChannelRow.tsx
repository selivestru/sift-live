import { Link } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'

import type {
  FollowedChannelsQuery,
  LiveChannelsQuery,
} from '~/shared/api/graphql/__generated__/graphql'
import { Avatar, AvatarFallback } from '~/shared/ui/Avatar'

type FollowedChannel = FollowedChannelsQuery['followedChannels'][number]
type ActiveChannel = LiveChannelsQuery['liveChannels'][number]

const initialsOf = (name: string) => name.slice(0, 2).toUpperCase()

interface ChannelRowProps {
  channel: FollowedChannel | ActiveChannel
}

export const ChannelRow = ({ channel }: ChannelRowProps) => {
  const t = useIntlayer('main-layout')

  return (
    <li className="h-12">
      <Link
        to="/$username"
        params={{ username: channel.username }}
        preload="intent"
        className="hover:bg-accent aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground flex h-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
      >
        <Avatar>
          <AvatarFallback>{initialsOf(channel.username)}</AvatarFallback>
        </Avatar>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium">{channel.username}</span>
          {channel.isLive && (
            <span className="text-muted-foreground truncate text-xs">{channel.category.title}</span>
          )}
        </span>
        {channel.isLive ? (
          <span className="text-destructive flex items-center gap-1 text-xs">
            <span className="bg-destructive inline-block size-1.5 rounded-full" />
            <span>{channel.viewerCount}</span>
          </span>
        ) : (
          <span className="text-muted-foreground font-medium">{t.offline.value}</span>
        )}
      </Link>
    </li>
  )
}
