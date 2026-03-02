export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'TMJ Open API',
    version: '1.0.0',
    description: 'REST API for interacting with Telegram via MTProto (GramJS)',
  },
  servers: [{ url: 'http://localhost:3000' }],
  tags: [
    { name: 'Auth', description: 'Authentication & Connection' },
    { name: 'Messages', description: 'Send & Read Messages' },
    { name: 'Bot', description: 'Bot Interactions' },
  ],
  paths: {
    '/api/my-telegram/connect': {
      post: {
        tags: ['Auth'],
        summary: 'Connect to Telegram',
        description: 'Starts the connection process. An OTP code will be sent to your phone.',
        responses: {
          200: {
            description: 'Connection process started',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  message: 'Proses koneksi dimulai. Cek HP untuk kode OTP, lalu kirim ke POST /api/my-telegram/auth',
                },
              },
            },
          },
        },
      },
    },
    '/api/my-telegram/auth': {
      post: {
        tags: ['Auth'],
        summary: 'Submit OTP Code',
        description: 'Submit the OTP code received on your phone.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthCodeDto' },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP submitted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          400: {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/my-telegram/auth-2fa': {
      post: {
        tags: ['Auth'],
        summary: 'Submit 2FA Password',
        description: 'Submit the Two-Step Verification password if your account has 2FA enabled.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Auth2faDto' },
            },
          },
        },
        responses: {
          200: {
            description: '2FA password submitted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          400: {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/my-telegram/send': {
      post: {
        tags: ['Messages'],
        summary: 'Send Message',
        description: 'Send a message as your Telegram user account.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SendMessageDto' },
            },
          },
        },
        responses: {
          200: {
            description: 'Message sent successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/SendMessageResult' },
                      },
                    },
                  ],
                },
                example: {
                  success: true,
                  message: 'Pesan berhasil dikirim',
                  data: { id: 123, date: 1709283600 },
                },
              },
            },
          },
          400: {
            description: 'Bad request or not connected',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/my-telegram/read': {
      post: {
        tags: ['Messages'],
        summary: 'Read Messages',
        description: 'Read messages from a chat.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReadMessageDto' },
            },
          },
        },
        responses: {
          200: {
            description: 'Messages retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          500: {
            description: 'Server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/my-telegram/bot-callback': {
      post: {
        tags: ['Bot'],
        summary: 'Bot Callback (Inline Button)',
        description: 'Simulate pressing an inline button on a bot message using GetBotCallbackAnswer.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BotCallbackDto' },
            },
          },
        },
        responses: {
          200: {
            description: 'Bot callback executed successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  message: 'Bot callback berhasil dijalankan',
                  data: { message: 'Response from bot', alert: false },
                },
              },
            },
          },
          400: {
            description: 'Bad request or not connected',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      AuthCodeDto: {
        type: 'object',
        required: ['code'],
        properties: {
          code: { type: 'string', example: '12345', description: 'OTP code from phone' },
        },
      },
      Auth2faDto: {
        type: 'object',
        required: ['password'],
        properties: {
          password: { type: 'string', example: 'my_2fa_password', description: 'Two-Step Verification password' },
        },
      },
      SendMessageDto: {
        type: 'object',
        required: ['chat_id', 'text'],
        properties: {
          chat_id: { type: 'string', example: '@username', description: 'Username or chat ID' },
          text: { type: 'string', example: 'Hello from Hono! 🔥', description: 'Message text' },
        },
      },
      ReadMessageDto: {
        type: 'object',
        required: ['chat_id'],
        properties: {
          chat_id: { type: 'string', example: '@username', description: 'Username or chat ID' },
          limit: { type: 'number', example: 5, description: 'Number of messages to read (default: 1)' },
        },
      },
      BotCallbackDto: {
        type: 'object',
        required: ['peer', 'msg_id', 'data'],
        properties: {
          peer: { type: 'string', example: '@some_bot', description: 'Bot username or chat ID' },
          msg_id: { type: 'number', example: 12345, description: 'Message ID with inline button' },
          data: { type: 'string', example: 'button_action', description: 'Callback data of the button' },
        },
      },
      SendMessageResult: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 123 },
          date: { type: 'number', example: 1709283600 },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
    },
  },
}
