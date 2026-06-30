import { UsersIcon } from 'lucide-react'
import { useIntlayer } from 'react-intlayer'

import { useFollowedChannels } from '~/features/channel'
import { useAuthStore } from '~/shared/auth'
import { Spinner } from '~/shared/ui/Spinner'

import { ChannelRow } from './ChannelRow'

export const FollowedChannels = () => {
  const t = useIntlayer('main-layout')

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const followedChannels = useFollowedChannels()

  if (!isAuthenticated) return

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-3 text-sm font-semibold">
        <UsersIcon className="text-muted-foreground size-4" />
        {t.followedChannels}
      </div>
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
  )
}
