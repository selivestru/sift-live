import { useIntlayer } from 'react-intlayer'

import type { ChannelQuery } from '~/shared/api/graphql/__generated__/graphql'

interface ChannelDescriptionProps {
  username: string
  channel: ChannelQuery['channel']
}

export const ChannelDescription = ({ username, channel }: ChannelDescriptionProps) => {
  const t = useIntlayer('channel-page')

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold">
        {t.info.value}: {username}
      </h2>
      <div className="bg-muted grid grid-cols-1 gap-6 rounded-md p-3 lg:grid-cols-[1fr_200px]">
        <div className="flex flex-col gap-4">
          {channel.tags && channel.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {channel.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-background text-muted-foreground rounded-sm px-2 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="text-sm">
            {channel.isLive ? 'Channel is currently live.' : t.offline.value}
          </p>
        </div>
      </div>
    </div>
  )
}
