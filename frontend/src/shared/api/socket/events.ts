export interface ChatMessage {
  id: string
  userId: string
  text: string
  channelId: string
  username: string
  color: string
}

export interface MessageSendPayload {
  channelId: string
  username: string
  text: string
}
