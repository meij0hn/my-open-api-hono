import type { Context } from 'hono'
import { telegramService } from '../services/telegram.service.js'
import type { AuthCodeDto, Auth2faDto, SendMessageDto, ReadMessageDto, BotCallbackDto } from '../dto/my-telegram.dto.js'

export const telegramController = {
  // POST /connect
  async connect(c: Context) {
    try {
      telegramService.connect().catch(console.error)
      return c.json({
        success: true,
        message: 'Proses koneksi dimulai. Cek HP untuk kode OTP, lalu kirim ke POST /api/my-telegram/auth',
      })
    } catch (error) {
      return c.json({ success: false, message: 'Gagal konek', error: String(error) }, 500)
    }
  },

  // POST /auth
  async auth(c: Context) {
    const { code } = await c.req.json<AuthCodeDto>()

    if (!code) {
      return c.json({ success: false, message: 'Kode OTP wajib diisi' }, 400)
    }

    const submitted = telegramService.submitAuthCode(code)
    if (!submitted) {
      return c.json({ success: false, message: 'Tidak ada proses login yang menunggu OTP' }, 400)
    }

    return c.json({
      success: true,
      message: 'Kode OTP berhasil dikirim. Jika akun punya 2FA, kirim password ke POST /api/my-telegram/auth-2fa',
    })
  },

  // POST /auth-2fa
  async auth2fa(c: Context) {
    const { password } = await c.req.json<Auth2faDto>()

    if (!password) {
      return c.json({ success: false, message: 'Password 2FA wajib diisi' }, 400)
    }

    const submitted = telegramService.submitAuth2fa(password)
    if (!submitted) {
      return c.json({ success: false, message: 'Tidak ada proses login yang menunggu password 2FA' }, 400)
    }

    return c.json({ success: true, message: 'Password 2FA berhasil dikirim' })
  },

  // POST /send
  async send(c: Context) {
    const { chat_id, text } = await c.req.json<SendMessageDto>()

    if (!chat_id || !text) {
      return c.json({ success: false, message: 'chat_id dan text wajib diisi' }, 400)
    }

    if (!telegramService.getIsConnected()) {
      return c.json({ success: false, message: 'Telegram belum terkoneksi. Hit POST /connect dulu' }, 400)
    }

    try {
      const data = await telegramService.sendMessage(chat_id, text)
      return c.json({ success: true, message: 'Pesan berhasil dikirim', data })
    } catch (error) {
      return c.json({ success: false, message: 'Gagal kirim pesan', error: String(error) }, 500)
    }
  },

  async read(c: Context) {
    const { chat_id, limit } = await c.req.json<ReadMessageDto>()
    try {
      const data = await telegramService.getMessages(chat_id, {limit: limit ?? 1,})
      return c.json({ success: true, message: 'Pesan berhasil dibaca', data })
    } catch (error) {
      return c.json({ success: false, message: 'Gagal membaca pesan', error: String(error) }, 500)
    }
  },

  // POST /bot-callback
  async botCallback(c: Context) {
    const { peer, msg_id, data } = await c.req.json<BotCallbackDto>()

    if (!peer || !msg_id || !data) {
      return c.json({ success: false, message: 'peer, msg_id, dan data wajib diisi' }, 400)
    }

    if (!telegramService.getIsConnected()) {
      return c.json({ success: false, message: 'Telegram belum terkoneksi. Hit POST /connect dulu' }, 400)
    }

    try {
      const result = await telegramService.getBotCallbackAnswer(peer, msg_id, data)
      return c.json({
        success: true,
        message: 'Bot callback berhasil dijalankan',
        data: { message: result.message, alert: result.alert },
      })
    } catch (error) {
      return c.json({ success: false, message: 'Gagal menjalankan bot callback', error: String(error) }, 500)
    }
  },
}
