import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import { useIntlayer } from 'react-intlayer'

import {
  CopyStreamKeyButton,
  ResetStreamKeyButton,
  StreamKeyAckDialog,
  getStreamKeyModalAck,
  setStreamKeyModalAck,
} from '~/features/reset-stream-key'
import { useAuthStore } from '~/shared/auth'
import { env } from '~/shared/config'
import { Button } from '~/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/Card'
import { Input } from '~/shared/ui/Input'

import { useStreamKey } from './stream-key'

export const StreamKeyCard = () => {
  const t = useIntlayer('profile')
  const username = useAuthStore((s) => s.user?.username)
  const { streamKey, fetching } = useStreamKey()
  const [revealed, setRevealed] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fullUrl = username && streamKey ? `${env.VITE_RTMP_URL}/${username}?token=${streamKey}` : ''

  const handleToggleReveal = () => {
    if (!revealed && !getStreamKeyModalAck()) {
      setDialogOpen(true)
    } else {
      setRevealed(!revealed)
    }
  }

  const handleAcknowledge = () => {
    setStreamKeyModalAck()
    setRevealed(true)
  }

  if (fetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.streamKeyTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted h-10 animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t.streamKeyTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            readOnly
            value={fullUrl}
            type={revealed ? 'text' : 'password'}
            className="font-mono text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleToggleReveal}>
              {revealed ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              {revealed ? t.hide : t.show}
            </Button>
            <CopyStreamKeyButton value={fullUrl} />
            <ResetStreamKeyButton />
          </div>
        </CardContent>
      </Card>
      <StreamKeyAckDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAcknowledge={handleAcknowledge}
      />
    </>
  )
}
