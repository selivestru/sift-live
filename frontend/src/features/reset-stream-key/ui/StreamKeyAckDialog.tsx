import { useIntlayer } from 'react-intlayer'

import { Button } from '~/shared/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/shared/ui/Dialog'

interface StreamKeyAckDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAcknowledge: () => void
}

export const StreamKeyAckDialog = ({
  open,
  onOpenChange,
  onAcknowledge,
}: StreamKeyAckDialogProps) => {
  const t = useIntlayer('profile')

  const handleAcknowledge = () => {
    onAcknowledge()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.streamKeyModalTitle}</DialogTitle>
          <DialogDescription className="text-destructive text-center font-semibold">
            {t.streamKeyModalWarning}
          </DialogDescription>
          <DialogDescription className="text-center">{t.streamKeyModalHint}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleAcknowledge}>{t.understand}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
