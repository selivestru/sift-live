import { type DefaultEventsMap, type Socket } from 'socket.io'
import { type AuthPayload } from '~/common/interfaces/auth-payload.interface'

export interface SocketData {
  user: AuthPayload | null
  anonymousId: string
}

export type AppSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>
