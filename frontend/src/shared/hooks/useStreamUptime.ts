import { useEffect, useState } from 'react'

const pad = (n: number) => n.toString().padStart(2, '0')

export const useStreamUptime = (startedAtIso: string) => {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const startedAt = new Date(startedAtIso).getTime()

    const tick = () => {
      const diff = Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
      setElapsed(diff)
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startedAtIso])

  const hours = Math.floor(elapsed / 3600)
  const minutes = Math.floor((elapsed % 3600) / 60)
  const seconds = elapsed % 60

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}
