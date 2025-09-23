import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { stocksApp } from './stocks'

const app = new Hono()

// CORS設定
app.use('*', cors({
  origin: ['http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
  exposeHeaders: ['Content-Type', 'Cache-Control'],
  credentials: true,
}))

// ヘルスチェック
app.get('/', (c) => {
  return c.json({
    message: 'Stock Monitor Backend API',
    status: 'running',
    timestamp: new Date().toISOString()
  })
})

// Stocks API routes
app.route('/api/stocks', stocksApp)

const port = 4000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})