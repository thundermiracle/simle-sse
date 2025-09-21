import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'

const app = new Hono()

// CORS設定
app.use('*', cors({
  origin: ['http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// ヘルスチェック
app.get('/', (c) => {
  return c.json({
    message: 'Stock Monitor Backend API',
    status: 'running',
    timestamp: new Date().toISOString()
  })
})

// API情報
app.get('/api', (c) => {
  return c.json({
    name: 'Stock Monitor API',
    version: '1.0.0',
    endpoints: {
      health: '/',
      api: '/api',
      stocks: '/api/stocks (planned for SSE)',
    }
  })
})

// 将来のSSE エンドポイント用のプレースホルダー
app.get('/api/stocks', (c) => {
  return c.json({
    message: 'SSE endpoint will be implemented here',
    note: 'This will stream real-time stock prices'
  })
})

const port = 3001
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})