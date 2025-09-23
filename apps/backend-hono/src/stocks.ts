import { Hono } from 'hono'
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

interface StockUpdatePayload {
  timestamp: string
  stocks: Stock[]
}

type StockSubscriber = (payload: StockUpdatePayload) => void

const subscribers = new Set<StockSubscriber>()

const notifySubscribers = (payload: StockUpdatePayload) => {
  subscribers.forEach((subscriber) => {
    try {
      subscriber(payload)
    } catch (error) {
      console.error('Failed to notify SSE subscriber:', error)
    }
  })
}

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

const stocksApp = new Hono()

const schedulePriceUpdates = () => {
  const delay = Math.random() * 2000 + 1000
  setTimeout(() => {
    for (let i = 0; i < STOCKS.length; i++) {
      STOCKS[i] = generatePriceUpdate(STOCKS[i])
    }

    notifySubscribers({
      timestamp: new Date().toISOString(),
      stocks: STOCKS,
    })

    schedulePriceUpdates()
  }, delay)
}

schedulePriceUpdates()

// SSE エンドポイント - 全銘柄のリアルタイム株価配信
stocksApp.get("/stream", (c) => {
  return streamSSE(c, async (stream) => {
    console.log("New SSE client connected");

    const sendUpdate = async (payload: StockUpdatePayload) => {
      await stream.writeSSE({
        data: JSON.stringify(payload),
        event: "stock-update",
        id: Date.now().toString(),
      })
    }

    const listener: StockSubscriber = (payload) => {
      void sendUpdate(payload).catch((error) => {
        console.error('Failed to push SSE update:', error)
      })
    }

    subscribers.add(listener)

    await sendUpdate({
      timestamp: new Date().toISOString(),
      stocks: STOCKS,
    })

    await new Promise<void>((resolve) => {
      stream.onAbort(() => {
        console.log("SSE client disconnected")
        subscribers.delete(listener)
        resolve()
      })
    })
  })
})

// 利用可能な銘柄一覧を取得
stocksApp.get('/', (c) => {
  return c.json({
    message: 'Available stocks',
    stocks: STOCKS.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      basePrice: stock.basePrice,
      currentPrice: stock.currentPrice,
      changePercent: stock.changePercent,
      lastUpdate: stock.lastUpdate,
    }))
  })
})

export { stocksApp }
