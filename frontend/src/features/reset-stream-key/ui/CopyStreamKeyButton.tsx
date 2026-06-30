import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { useIntlayer } from 'react-intlayer'

import { Button } from '~/shared/ui/Button'

interface CopyStreamKeyButtonProps {
  value: string
}

export const CopyStreamKeyButton = ({ value }: CopyStreamKeyButtonProps) => {
  const t = useIntlayer('profile')
  const [justCopied, setJustCopied] = useState(false)

  const handleCopy = async () => {
    if (justCopied) return
    await navigator.clipboard.writeText(value)
    setJustCopied(true)
    setTimeout(() => setJustCopied(false), 2000)
  }

  return (
    <Button
      type="button"
      variant={justCopied ? 'success' : 'outline'}
      size="sm"
      onClick={handleCopy}
    >
      {justCopied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
      {justCopied ? t.copied : t.copy}
    </Button>
  )
}
