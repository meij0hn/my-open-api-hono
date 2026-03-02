import { Hono } from 'hono'
import { telegramController } from '../controllers/my-telegram.controller.js'

const myTelegram = new Hono()

myTelegram.post('/connect', telegramController.connect)
myTelegram.post('/auth', telegramController.auth)
myTelegram.post('/auth-2fa', telegramController.auth2fa)
myTelegram.post('/send', telegramController.send)
myTelegram.post('/read', telegramController.read)
myTelegram.post('/bot-callback', telegramController.botCallback)

export default myTelegram
