import { LogInIcon } from 'lucide-react'
import { useIntlayer } from 'react-intlayer'

import { useAuthDialog, useAuthStore } from '~/shared/auth'
import { Button } from '~/shared/ui/Button'

import { ChatInput } from './ChatInput'
import { ChatSettings } from './ChatSettings'

interface ChatFooterProps {
  channelId: string
  username: string
}

export const ChatFooter = ({ channelId, username }: ChatFooterProps) => {
  const t = useIntlayer('chat-box')

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const openDialog = useAuthDialog((s) => s.open)

  return (
    <div className="border-t p-3">
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          <ChatSettings />
          <ChatInput channelId={channelId} username={username} />
        </div>
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
  )
}
