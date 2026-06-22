import { useSyncExternalStore } from 'react'
import { io, Socket } from 'socket.io-client'

import { useAuthStore } from '~/shared/auth/auth.store'
import { env } from '~/shared/config/env'

let socket: Socket | null = null
let lastToken: string | null | undefined = undefined
let unSubAuth: (() => void) | null = null

const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

const getSnapshot = (): Socket | null => socket

const create = (token: string | null): Socket => {
  const s = io(env.VITE_API_URL, {
    auth: token ? { token } : {},
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Number.POSITIVE_INFINITY,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 30_000,
  })

  if (import.meta.env.DEV) {
    s.on('connect', () => console.log('[socket] connected', s.id))
    s.on('disconnect', (reason) => console.log('[socket] disconnected', reason))
    s.on('connect_error', (err) => console.log('[socket] connect_error', err.message))
  }

  return s
}

const sync = () => {
  const token = useAuthStore.getState().token
  if (token === lastToken) return

  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
  }

  lastToken = token
  socket = create(token)
  notify()
}

export const startSocket = () => {
  if (unSubAuth) return
  sync()
  unSubAuth = useAuthStore.subscribe((state) => {
    if (state.token !== lastToken) sync()
  })
}

export const stopSocket = () => {
  unSubAuth?.()
  unSubAuth = null
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
  }
  socket = null
  lastToken = undefined
  notify()
}

export const getSocket = (): Socket | null => socket

export const useSocket = (): Socket | null =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
