import { LogInIcon, SendIcon } from 'lucide-react'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useIntlayer } from 'react-intlayer'

import { useAuthDialog, useAuthStore } from '~/shared/auth'
import { Button } from '~/shared/ui/Button'
import { Input } from '~/shared/ui/Input'

import { ChatHeader } from './ChatHeader'

interface ChatBoxProps {
  username: string
}

interface ChatFormValues {
  text: string
}

export const ChatBox = ({ username }: ChatBoxProps) => {
  const t = useIntlayer('chat-box')

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const openDialog = useAuthDialog((s) => s.open)

  const { register, handleSubmit, reset, watch } = useForm<ChatFormValues>({
    defaultValues: { text: '' },
  })

  const textValue = watch('text')
  // const canSend = isAuthenticated && textValue.trim().length > 0 && !sending

  const listRef = useRef<HTMLUListElement>(null)

  const onSubmit = (values: ChatFormValues) => {
    // if (!canSend) return
    // send(values.text)
    reset({ text: '' })
  }

  return (
    <div className="bg-background flex h-full flex-col overflow-hidden">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p className="bg-muted text-muted-foreground mb-3 rounded-md px-3 py-2 text-xs">
          {t.welcomeMessage.value}
        </p>
        <ul ref={listRef} className="flex flex-col gap-2">
          {/* {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))} */}
        </ul>
      </div>

      <div className="shrink-0 border-t p-3">
        {isAuthenticated ? (
          <form className="flex items-center gap-2" onSubmit={handleSubmit(onSubmit)}>
            <Input
              placeholder={t.inputPlaceholder.value}
              aria-label={t.inputPlaceholder.value}
              // disabled={sending}
              maxLength={500}
              {...register('text')}
            />
            <Button
              type="submit"
              size="icon"
              // disabled={!canSend}
              aria-label={t.inputPlaceholder.value}
              // isLoading={sending}
            >
              <SendIcon />
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-muted-foreground text-center text-xs">{t.chatDisabled.value}</p>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => openDialog('login')}
            >
              <LogInIcon />
              {t.signInButton.value}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
