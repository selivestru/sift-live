import { useSyncExternalStore } from 'react'
import { io } from 'socket.io-client'

import { useAuthStore } from '~/shared/auth/auth.store'
import { env } from '~/shared/config/env'

import type { AppSocket } from './types'

let socket: AppSocket | null = null
let lastToken: string | null | undefined = undefined
let unsubAuth: (() => void) | null = null

const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

const getSnapshot = (): AppSocket | null => socket

const create = (token: string | null): AppSocket => {
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
  if (unsubAuth) return
  sync()
  unsubAuth = useAuthStore.subscribe((state) => {
    if (state.token !== lastToken) sync()
  })
}

export const stopSocket = () => {
  unsubAuth?.()
  unsubAuth = null
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
  }
  socket = null
  lastToken = undefined
  notify()
}

export const getSocket = (): AppSocket | null => socket

export const useSocket = (): AppSocket | null =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
