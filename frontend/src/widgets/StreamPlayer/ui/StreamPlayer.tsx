import { TvIcon } from 'lucide-react'
import { useState } from 'react'
import { useIntlayer } from 'react-intlayer'

import { cn } from '~/shared/lib/utils'

interface StreamPlayerProps {
  isLive: boolean
  className?: string
}

export const StreamPlayer = ({ isLive, className }: StreamPlayerProps) => {
  const t = useIntlayer('stream-player')

  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)

  return (
    <div
      className={cn(
        'group/player relative aspect-video w-full overflow-hidden bg-muted',
        className,
      )}
    >
      <div className="from-muted via-muted/80 to-accent/10 absolute inset-0 grid place-items-center bg-linear-to-br">
        <div className="text-muted-foreground flex flex-col items-center gap-3">
          <TvIcon className="size-16 opacity-60" />
          <p className="text-sm font-medium">{t.placeholder}</p>
        </div>
      </div>

      {/* <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-black/60 to-transparent p-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white hover:bg-white/20 hover:text-white"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause' : 'Play'}
            disabled={!isLive}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white hover:bg-white/20 hover:text-white"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Unmute' : 'Mute'}
            disabled={!isLive}
          >
            {muted ? <VolumeXIcon /> : <Volume2Icon />}
          </Button>
        </div>
      </div> */}
    </div>
  )
}
