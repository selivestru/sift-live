import { useEffect, useState } from 'react'
import { useIntlayer } from 'react-intlayer'

import { ChannelMessages } from '~/pages/channel/ui/ChannelMessages'
import { useSocket } from '~/shared/api/socket'

import { ChatFooter } from './ChatFooter'
import { ChatHeader } from './ChatHeader'

interface ChatBoxProps {
  channelId: string
  username: string
}

export const ChatBox = ({ channelId, username }: ChatBoxProps) => {
  const t = useIntlayer('chat-box')
  const socket = useSocket()

  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (!socket) {
      setSubscribed(false)
      return
    }

    const handler = (data: { channelId: string }) => {
      if (data.channelId === channelId) {
        setSubscribed(true)
      }
    }

    socket.on('channel:subscribed', handler)

    return () => {
      socket.off('channel:subscribed', handler)
      setSubscribed(false)
    }
  }, [socket, channelId])

  return (
    <div className="bg-background flex h-full flex-col overflow-hidden">
      <ChatHeader />

      <ChannelMessages />

      {!subscribed && (
        <div className="bg-muted/50 text-muted-foreground border-t px-3 py-2 text-center text-xs">
          {t.connecting.value}
        </div>
      )}

      <ChatFooter channelId={channelId} username={username} />
    </div>
  )
}
