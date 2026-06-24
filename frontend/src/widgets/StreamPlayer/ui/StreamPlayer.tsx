import { TvIcon } from 'lucide-react'
import { useRef } from 'react'
import { useIntlayer } from 'react-intlayer'

interface StreamPlayerProps {
  isLive: boolean
}

export const StreamPlayer = ({ isLive }: StreamPlayerProps) => {
  const t = useIntlayer('stream-player')

  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div className="group/player bg-muted relative aspect-video w-full overflow-hidden">
      {!isLive ? (
        <div>123</div>
      ) : (
        <div className="from-muted via-muted/80 to-accent/10 absolute inset-0 grid place-items-center bg-linear-to-br">
          <div className="text-muted-foreground flex flex-col items-center gap-3">
            <TvIcon className="size-16 opacity-60" />
            <p className="text-sm font-medium">{t.placeholder}</p>
          </div>
        </div>
      )}
    </div>
  )
}
