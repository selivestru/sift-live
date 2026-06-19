import { useEffect } from 'react'

import { startSocket, stopSocket } from '~/shared/api/socket'

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    startSocket()
    return () => stopSocket()
  }, [])

  return <>{children}</>
}
