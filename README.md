# 🔥 TMJ Open API

REST API backend built with **Hono** + **TypeScript** for interacting with Telegram via MTProto (GramJS).

## Tech Stack

- [Hono](https://hono.dev) — Lightweight web framework
- [GramJS](https://github.com/nickg/gram-js) — Telegram MTProto client
- TypeScript + Node.js

## Project Structure

```
src/
├── index.ts                              # Entry point & server
├── routes/
│   └── my-telegram.ts                    # Route definitions
├── controllers/
│   └── my-telegram.controller.ts         # Request handling & validation
├── services/
│   └── telegram.service.ts               # Business logic (TelegramClient)
└── dto/
    └── my-telegram.dto.ts                # Type definitions
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

Copy `.env.example` or create `.env`:

```env
API_ID=your_api_id
API_HASH=your_api_hash
PHONE_NUMBER=+628xxxxxxxxxx
STRING_SESSION=
```

> Get `API_ID` & `API_HASH` from [my.telegram.org/apps](https://my.telegram.org/apps)

### 3. Run Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

### 4. Build & Production

```bash
npm run build
npm start
```

---

## API Endpoints

Base URL: `http://localhost:3000/api/my-telegram`

### 🔌 Connect to Telegram

Starts the connection process. An OTP code will be sent to your phone.

```
POST /api/my-telegram/connect
```

**Response:**

```json
{
  "success": true,
  "message": "Proses koneksi dimulai. Cek HP untuk kode OTP..."
}
```

---

### 🔑 Submit OTP Code

Submit the OTP code received on your phone.

```
POST /api/my-telegram/auth
```

**Body:**

```json
{
  "code": "12345"
}
```

---

### 🔐 Submit 2FA Password

If your account has Two-Step Verification enabled.

```
POST /api/my-telegram/auth-2fa
```

**Body:**

```json
{
  "password": "your_2fa_password"
}
```

> After successful authentication, the server will print a `STRING_SESSION` in the terminal. Save it to `.env` so you don't need to re-authenticate on every restart.

---

### 📤 Send Message

Send a message as your Telegram user account.

```
POST /api/my-telegram/send
```

**Body:**

```json
{
  "chat_id": "username_or_chat_id",
  "text": "Hello from Hono! 🔥"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Pesan berhasil dikirim",
  "data": { "id": 123, "date": 1709283600 }
}
```

---

### 📥 Read Messages

Read messages from a chat.

```
POST /api/my-telegram/read
```

**Body:**

```json
{
  "chat_id": "username_or_chat_id",
  "limit": 5
}
```

---

### 🤖 Bot Callback (Inline Button)

Simulate pressing an inline button on a bot message.

```
POST /api/my-telegram/bot-callback
```

**Body:**

```json
{
  "peer": "@bot_username",
  "msg_id": 12345,
  "data": "callback_data"
}
```

| Field    | Type     | Description                             |
| -------- | -------- | --------------------------------------- |
| `peer`   | `string` | Bot username or chat ID                 |
| `msg_id` | `number` | Message ID containing the inline button |
| `data`   | `string` | Callback data of the button to press    |

---

## Authentication Flow

```
1. POST /connect        → OTP sent to phone
2. POST /auth           → Submit OTP code
3. POST /auth-2fa       → Submit 2FA password (if enabled)
4. Save STRING_SESSION  → Add to .env for persistent login
```

## License

MIT
