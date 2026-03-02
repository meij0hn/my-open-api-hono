import { TelegramClient, Api } from 'telegram'
import { StringSession } from 'telegram/sessions'
import type { SendMessageResult } from '../dto/my-telegram.dto.js'

// Untuk menyimpan resolver OTP dan 2FA password
let pendingCodeResolve: ((code: string) => void) | null = null
let pendingPasswordResolve: ((password: string) => void) | null = null

class TelegramService {
  private client: TelegramClient
  private isConnected = false

  constructor() {
    const apiId = Number(process.env.API_ID)
    const apiHash = process.env.API_HASH!
    const stringSession = new StringSession(process.env.STRING_SESSION || '')

    this.client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    })
  }

  async connect(): Promise<void> {
    if (this.isConnected) return

    await this.client.start({
      phoneNumber: process.env.PHONE_NUMBER!,
      phoneCode: async () => {
        return new Promise((resolve) => {
          pendingCodeResolve = resolve
        })
      },
      password: async () => {
        console.log('⚠️ 2FA diperlukan! Kirim password ke POST /api/my-telegram/auth-2fa')
        return new Promise((resolve) => {
          pendingPasswordResolve = resolve
        })
      },
      onError: (err) => console.error('Telegram auth error:', err),
    })

    const session = this.client.session.save() as unknown as string
    console.log('✅ Telegram connected!')
    console.log('📋 Save this STRING_SESSION to .env:')
    console.log(session)

    this.isConnected = true
  }

  submitAuthCode(code: string): boolean {
    if (!pendingCodeResolve) return false
    pendingCodeResolve(code)
    pendingCodeResolve = null
    return true
  }

  submitAuth2fa(password: string): boolean {
    if (!pendingPasswordResolve) return false
    pendingPasswordResolve(password)
    pendingPasswordResolve = null
    return true
  }

  getIsConnected(): boolean {
    return this.isConnected
  }

  async sendMessage(chatId: string, text: string): Promise<SendMessageResult> {
    const result = await this.client.sendMessage(chatId, { message: text })
    return { id: result.id, date: result.date }
  }

  async getMessages(chatId: string, options: { limit?: number }): Promise<any[]> {
    const messages = await this.client.getMessages(chatId, options)
    return messages
  }

  async getBotCallbackAnswer(peer: string, msgId: number, data: string): Promise<Api.messages.BotCallbackAnswer> {
    const result = await this.client.invoke(
      new Api.messages.GetBotCallbackAnswer({
        peer,
        msgId,
        data: Buffer.from(data, 'utf-8'),
      })
    )
    return result
  }
}

// Singleton instance
export const telegramService = new TelegramService()
