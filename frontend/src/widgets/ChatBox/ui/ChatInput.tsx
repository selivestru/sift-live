import { SendIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useIntlayer } from 'react-intlayer'

import type { MessageSendPayload } from '~/shared/api/socket'
import { useSocket } from '~/shared/api/socket'
import { useAuthStore } from '~/shared/auth'
import { Button } from '~/shared/ui/Button'
import { Input } from '~/shared/ui/Input'

interface ChatInputProps {
  channelId: string
  username: string
}

interface ChatFormValues {
  text: string
}

export const ChatInput = ({ channelId, username }: ChatInputProps) => {
  const t = useIntlayer('chat-box')

  const socket = useSocket()

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const { register, handleSubmit, reset, watch } = useForm<ChatFormValues>({
    defaultValues: { text: '' },
  })

  const textValue = watch('text')
  const canSend = isAuthenticated && textValue.trim().length > 0

  const onSubmit = (values: ChatFormValues) => {
    if (!canSend) return

    const payload: MessageSendPayload = {
      channelId,
      username,
      text: values.text,
    }

    socket?.emit('message:send', payload)

    reset()
  }

  return (
    <form className="flex flex-1 items-center gap-2" onSubmit={handleSubmit(onSubmit)}>
      <Input
        placeholder={t.inputPlaceholder.value}
        aria-label={t.inputPlaceholder.value}
        maxLength={500}
        {...register('text')}
      />
      <Button type="submit" size="icon" disabled={!canSend} aria-label={t.inputPlaceholder.value}>
        <SendIcon />
      </Button>
    </form>
  )
}
