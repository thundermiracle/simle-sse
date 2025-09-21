import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { streamSSE } from 'hono/streaming'

interface Stock {
  symbol: string
  name: string
  basePrice: number
  currentPrice: number
  changePercent: number
  lastUpdate: string
}

const STOCKS: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 150, currentPrice: 150, changePercent: 0, lastUpdate: new Date().toISOString() },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 2800, currentPrice: 2800, changePercent: 0, lastUpdate: new Date().toISOString() },
  { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 250, currentPrice: 250, changePercent: 0, lastUpdate: new Date().toISOString() },
  { symbol: 'NFLX', name: 'Netflix Inc.', basePrice: 400, currentPrice: 400, changePercent: 0, lastUpdate: new Date().toISOString() },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', basePrice: 500, currentPrice: 500, changePercent: 0, lastUpdate: new Date().toISOString() }
]

function generatePriceUpdate(stock: Stock): Stock {
  const maxChange = 0.05
  const randomChange = (Math.random() - 0.5) * 2 * maxChange
  const newPrice = stock.currentPrice * (1 + randomChange)
  const changeFromBase = ((newPrice - stock.basePrice) / stock.basePrice) * 100

  return {
    ...stock,
    currentPrice: Math.round(newPrice * 100) / 100,
    changePercent: Math.round(changeFromBase * 100) / 100,
    lastUpdate: new Date().toISOString()
  }
}

const app = new Hono()

// CORS設定
app.use('*', cors({
  origin: ['http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
  exposeHeaders: ['Content-Type'],
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
      stocks: '/api/stocks - Get available stocks list',
      sse: '/api/stocks/stream - Real-time stock prices via SSE',
    }
  })
})

// SSE エンドポイント - 全銘柄のリアルタイム株価配信
app.get('/api/stocks/stream', (c) => {
  return streamSSE(c, async (stream) => {
    console.log('New SSE client connected')

    const sendStockData = () => {
      // 全銘柄の価格を更新
      for (let i = 0; i < STOCKS.length; i++) {
        STOCKS[i] = generatePriceUpdate(STOCKS[i])
      }

      // 全銘柄のデータを送信
      const stockData = {
        timestamp: new Date().toISOString(),
        stocks: STOCKS
      }

      stream.writeSSE({
        data: JSON.stringify(stockData),
        event: 'stock-update'
      })
    }

    // 初回データ送信
    sendStockData()

    // 1秒間隔でデータ更新
    const interval = setInterval(sendStockData, 1000)

    // クライアント切断時のクリーンアップ
    stream.onAbort(() => {
      console.log('SSE client disconnected')
      clearInterval(interval)
    })
  })
})

// 利用可能な銘柄一覧を取得
app.get('/api/stocks', (c) => {
  return c.json({
    message: 'Available stocks',
    stocks: STOCKS.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      basePrice: stock.basePrice
    }))
  })
})

const port = 4000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})