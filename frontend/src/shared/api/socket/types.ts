import type { Socket } from 'socket.io-client'

export interface ServerToClientEvents {}

export interface ClientToServerEvents {}

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>
