import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui'
import myTelegram from './routes/my-telegram.js'
import { openApiSpec } from './docs/openapi.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Swagger UI
app.get('/docs', swaggerUI({ url: '/docs/json' }))
app.get('/docs/json', (c) => c.json(openApiSpec))

// Mount routes
app.route('/api/my-telegram', myTelegram)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
  console.log(`Swagger docs: http://localhost:${info.port}/docs`)
})
