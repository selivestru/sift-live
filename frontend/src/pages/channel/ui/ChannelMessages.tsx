import { useEffect, useRef, useState } from 'react'

import { useSocket } from '~/shared/api/socket'
import type { ChatMessage } from '~/shared/api/socket/events'
import { MessageItem } from '~/widgets/ChatBox/ui/MessageItem'

export const ChannelMessages = () => {
  const socket = useSocket()

  const listRef = useRef<HTMLUListElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    if (!socket) return

    const handler = (payload: ChatMessage) => {
      setMessages((prev) => [...prev, payload])
    }

    socket.on('message:new', handler)

    return () => {
      socket.off('message:new', handler)
    }
  }, [socket])

  return (
    <ul ref={listRef} className="flex flex-col gap-2">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </ul>
  )
}
