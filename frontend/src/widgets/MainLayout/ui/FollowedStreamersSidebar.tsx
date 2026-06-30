import { Link } from '@tanstack/react-router'
import { FlameIcon, UsersIcon, type LucideIcon } from 'lucide-react'
import { useIntlayer } from 'react-intlayer'

import { useActiveChannels, useFollowedChannels } from '~/features/channel'
import type {
  FollowedChannelsQuery,
  LiveChannelsQuery,
} from '~/shared/api/graphql/__generated__/graphql'
import { useAuthStore } from '~/shared/auth'
import { Avatar, AvatarFallback } from '~/shared/ui/Avatar'
import { Spinner } from '~/shared/ui/Spinner'

type FollowedChannel = FollowedChannelsQuery['followedChannels'][number]
type ActiveChannel = LiveChannelsQuery['liveChannels'][number]

const initialsOf = (name: string) => name.slice(0, 2).toUpperCase()

const ChannelRow = ({ channel }: { channel: FollowedChannel | ActiveChannel }) => (
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
          <span>0</span>
        </span>
      ) : (
        <span className="text-muted-foreground font-medium">Offline</span>
      )}
    </Link>
  </li>
)

const BlockHeader = ({ title, icon: Icon }: { title: string; icon: LucideIcon }) => (
  <div className="flex items-center gap-2 px-4 py-3 text-sm font-semibold">
    <Icon className="text-muted-foreground size-4" />
    {title}
  </div>
)

export const FollowedStreamersSidebar = () => {
  const t = useIntlayer('main-layout')

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const followedChannels = useFollowedChannels()
  const activeChannels = useActiveChannels()

  return (
    <aside
      className="bg-background hidden flex-col overflow-y-auto border-r lg:flex"
      data-slot="main-layout-sidebar"
    >
      {isAuthenticated && (
        <div>
          <BlockHeader title={t.followedChannels} icon={UsersIcon} />
          {!followedChannels.data && followedChannels.fetching ? (
            <Spinner variant="inline" />
          ) : (
            <>
              {!followedChannels?.data?.onlineChannels.length &&
              !followedChannels?.data?.offlineChannels.length ? (
                <p className="text-muted-foreground text-center text-xs">{t.noFollowed}</p>
              ) : (
                <nav className="flex flex-col gap-3 px-2 pb-4">
                  {followedChannels.data.onlineChannels.length > 0 && (
                    <ul className="flex flex-col gap-0.5">
                      {followedChannels.data.onlineChannels.map((channel) => (
                        <ChannelRow key={channel.id} channel={channel} />
                      ))}
                    </ul>
                  )}

                  {followedChannels.data.offlineChannels.length > 0 && (
                    <ul className="flex flex-col gap-0.5">
                      {followedChannels.data.offlineChannels.map((channel) => (
                        <ChannelRow key={channel.id} channel={channel} />
                      ))}
                    </ul>
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      )}

      <div>
        <BlockHeader title={t.activeChannels} icon={FlameIcon} />
        {!activeChannels.data && activeChannels.fetching ? (
          <Spinner variant="inline" />
        ) : (
          <>
            {activeChannels?.data?.length ? (
              <nav className="flex flex-col gap-3 px-2 pb-4">
                <ul className="flex flex-col gap-0.5">
                  {activeChannels.data.map((channel) => (
                    <ChannelRow key={channel.id} channel={channel} />
                  ))}
                </ul>
              </nav>
            ) : (
              <p className="text-muted-foreground text-center text-xs">{t.noActiveChannels}</p>
            )}
          </>
        )}
      </div>
    </aside>
  )
}
