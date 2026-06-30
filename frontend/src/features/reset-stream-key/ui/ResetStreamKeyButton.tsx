import { CheckIcon, RefreshCwIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { useIntlayer } from 'react-intlayer'

import { Button } from '~/shared/ui/Button'

import { useResetStreamKey } from '../model/reset-stream-key'
import { getStreamKeyModalAck, setStreamKeyModalAck } from '../model/stream-key-modal-ack'
import { StreamKeyAckDialog } from './StreamKeyAckDialog'

export const ResetStreamKeyButton = () => {
  const t = useIntlayer('profile')
  const { reset, fetching } = useResetStreamKey()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [justReset, setJustReset] = useState(false)
  const [justFailed, setJustFailed] = useState(false)

  const clearTransientStates = () => {
    setTimeout(() => {
      setJustReset(false)
      setJustFailed(false)
    }, 2000)
  }

  const handleReset = async () => {
    try {
      const result = await reset()
      if (result) {
        setJustReset(true)
      } else {
        setJustFailed(true)
      }
    } catch {
      setJustFailed(true)
    }
    clearTransientStates()
  }

  const handleClick = () => {
    if (!getStreamKeyModalAck()) {
      setDialogOpen(true)
    } else {
      handleReset()
    }
  }

  const handleAcknowledge = () => {
    setStreamKeyModalAck()
    handleReset()
  }

  return (
    <>
      <Button
        type="button"
        variant={justReset ? 'success' : justFailed ? 'error' : 'outline'}
        size="sm"
        isLoading={fetching}
        onClick={handleClick}
      >
        {!fetching &&
          (justReset ? (
            <CheckIcon className="size-4" />
          ) : justFailed ? (
            <XIcon className="size-4" />
          ) : (
            <RefreshCwIcon className="size-4" />
          ))}
        {justReset ? t.resetSuccess : justFailed ? t.resetFailed : t.reset}
      </Button>
      <StreamKeyAckDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAcknowledge={handleAcknowledge}
      />
    </>
  )
}
