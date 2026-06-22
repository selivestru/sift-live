import type { ChatMessage } from '~/shared/api/socket/events'

interface MessageItemProps {
  message: ChatMessage
}

export const MessageItem = ({ message }: MessageItemProps) => {
  return (
    <li className="flex items-start gap-2 text-sm leading-snug">
      <p className="min-w-0 flex-1 break-all">
        <span
          style={{ color: message.color }}
          className="inline-flex items-center gap-1 font-semibold"
        >
          {message.username}
        </span>
        {': '}
        <span>{message.text}</span>
      </p>
    </li>
  )
}
