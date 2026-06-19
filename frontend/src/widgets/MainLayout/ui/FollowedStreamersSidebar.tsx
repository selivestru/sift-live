import { useIntlayer } from 'react-intlayer'

import type {
  FollowedChannelsQuery,
  LiveChannelsQuery,
} from '~/shared/api/graphql/__generated__/graphql'

type FollowedChannel = FollowedChannelsQuery['followedChannels'][number]
type ActiveChannel = LiveChannelsQuery['liveChannels'][number]

// const initialsOf = (name: string) => name.slice(0, 2).toUpperCase()

// const formatViewers = (count: number) => count.toLocaleString()

// const ChannelRow = ({ channel }: { channel: FollowedChannel | ActiveChannel }) => (
//   <li>
//     <Link
//       to="/$username"
//       params={{ username: channel.username }}
//       preload="intent"
//       className="hover:bg-accent aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
//     >
//       <Avatar size="sm">
//         <AvatarFallback>{initialsOf(channel.username)}</AvatarFallback>
//       </Avatar>
//       <span className="flex min-w-0 flex-1 flex-col">
//         <span className="truncate font-medium">{channel.username}</span>
//         <span className="text-muted-foreground truncate text-xs">
//           {channel.category ?? 'No category'}
//         </span>
//       </span>
//       {channel.isLive ? (
//         <span className="text-destructive flex items-center gap-1 text-xs">
//           <span className="bg-destructive inline-block size-1.5 rounded-full" />
//           {formatViewers(channel.viewerCount)}
//         </span>
//       ) : (
//         <span className="text-muted-foreground text-xs">Offline</span>
//       )}
//     </Link>
//   </li>
// )

// const Section = ({ title, children }: { title: string; children: ReactNode }) => (
//   <section>
//     <h3 className="text-muted-foreground px-2 py-1 text-xs font-medium tracking-wide uppercase">
//       {title}
//     </h3>
//     <ul className="flex flex-col gap-0.5">{children}</ul>
//   </section>
// )

// const BlockHeader = ({ title, icon: Icon }: { title: string; icon: typeof UsersIcon }) => (
//   <div className="flex items-center gap-2 px-4 py-3 text-sm font-semibold">
//     <Icon className="text-muted-foreground size-4" />
//     {title}
//   </div>
// )

export const FollowedStreamersSidebar = () => {
  const t = useIntlayer('main-layout')

  // const followedChannels = useFollowedChannels()
  // const activeChannels = useActiveChannels()

  return (
    <aside
      className="bg-background hidden flex-col gap-2 overflow-y-auto border-r lg:flex"
      data-slot="main-layout-sidebar"
    >
      {/* <div>
        <BlockHeader title={t.followedChannels} icon={UsersIcon} />
        {followedChannels.fetching ? (
          <Spinner variant="inline" />
        ) : (
          <>
            {!followedChannels.data.onlineChannels.length &&
            !followedChannels.data.offlineChannels.length ? (
              <p className="text-muted-foreground text-center text-xs">{t.noFollowed}</p>
            ) : (
              <nav className="flex flex-col gap-3 px-2 pb-4">
                {followedChannels.data.onlineChannels.length > 0 && (
                  <Section title={t.live}>
                    {followedChannels.data.onlineChannels.map((channel) => (
                      <ChannelRow key={channel.id} channel={channel} />
                    ))}
                  </Section>
                )}

                {followedChannels.data.offlineChannels.length > 0 && (
                  <Section title={t.offline}>
                    {followedChannels.data.offlineChannels.map((channel) => (
                      <ChannelRow key={channel.id} channel={channel} />
                    ))}
                  </Section>
                )}
              </nav>
            )}
          </>
        )}
      </div>

      <div>
        <BlockHeader title={t.activeChannels} icon={FlameIcon} />
        {activeChannels.fetching ? (
          <Spinner variant="inline" />
        ) : (
          <>
            {activeChannels.data.length ? (
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
      </div> */}
    </aside>
  )
}
