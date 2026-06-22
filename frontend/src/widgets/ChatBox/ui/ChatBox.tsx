import { useIntlayer } from 'react-intlayer'

import { ChannelMessages } from '~/pages/channel/ui/ChannelMessages'

import { ChatFooter } from './ChatFooter'
import { ChatHeader } from './ChatHeader'

interface ChatBoxProps {
  channelId: string
  username: string
}

export const ChatBox = ({ channelId, username }: ChatBoxProps) => {
  const t = useIntlayer('chat-box')

  return (
    <div className="bg-background flex h-full flex-col overflow-hidden">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p className="bg-muted text-muted-foreground mb-3 rounded-md px-3 py-2 text-xs">
          {t.welcomeMessage.value}
        </p>
        <ChannelMessages />
      </div>

      <ChatFooter channelId={channelId} username={username} />
    </div>
  )
}
