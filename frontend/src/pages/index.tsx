// oxlint-disable jsx-a11y/control-has-associated-label jsx-a11y/media-has-caption
import { createFileRoute } from '@tanstack/react-router'
import Hls from 'hls.js'
import { useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamUrl = 'http://localhost:8888/live/test/index.m3u8'

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls({
        liveSyncDuration: 2,
        enableWorker: true,
      })

      hls.loadSource(streamUrl)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log('Автоплей заблокирован браузером:', err))
      })

      return () => {
        hls.destroy()
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl
    }
  }, [])

  return (
    <div className="h-dvh w-full">
      <video ref={videoRef} className="size-full" />
    </div>
  )
}
