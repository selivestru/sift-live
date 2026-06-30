import { FlameIcon } from 'lucide-react'
import { useIntlayer } from 'react-intlayer'

import { useActiveChannels } from '~/features/channel'
import { Spinner } from '~/shared/ui/Spinner'

import { ChannelRow } from './ChannelRow'

export const ActiveChannels = () => {
  const t = useIntlayer('main-layout')

  const activeChannels = useActiveChannels()

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-3 text-sm font-semibold">
        <FlameIcon className="text-muted-foreground size-4" />
        {t.activeChannels}
      </div>
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
  )
}
