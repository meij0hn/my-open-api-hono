// DTO untuk request/response Telegram endpoints

export interface AuthCodeDto {
  code: string
}

export interface Auth2faDto {
  password: string
}

export interface SendMessageDto {
  chat_id: string
  text: string
}

export interface TelegramResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface SendMessageResult {
  id: number
  date?: number
}

export interface ReadMessageDto {
  chat_id: string
  limit?: number
}

export interface BotCallbackDto {
  peer: string
  msg_id: number
  data: string
}
