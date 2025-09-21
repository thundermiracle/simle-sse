import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { StockBoard } from '@/components/StockBoard'
import { ConnectionStatusIndicator } from '@/components/ConnectionStatus'
import { Stock, StockUpdate, ConnectionStatus } from '@/types/stock'

function App() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const eventSourceRef = useRef<EventSource | null>(null)

  const fetchStockList = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/stocks')
      if (!response.ok) {
        throw new Error('Failed to fetch stock list')
      }
      const data = await response.json()
      const stocksWithDashPrices = data.stocks.map((stock: Stock) => ({
        ...stock,
        currentPrice: 0,
        changePercent: 0,
        lastUpdate: new Date().toISOString()
      }))
      setStocks(stocksWithDashPrices)
    } catch (error) {
      console.error('Error fetching stock list:', error)
    }
  }

  useEffect(() => {
    fetchStockList()
  }, [])

  const connect = () => {
    if (eventSourceRef.current) return

    setConnectionStatus('connecting')
    const eventSource = new EventSource('http://localhost:4000/api/stocks/stream')
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setConnectionStatus('connected')
    }

    eventSource.addEventListener('stock-update', (event) => {
      try {
        const data: StockUpdate = JSON.parse(event.data)
        setStocks(data.stocks)
      } catch (error) {
        console.error('Error parsing stock data:', error)
        setConnectionStatus('error')
      }
    })

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      console.error('EventSource readyState:', eventSource.readyState)
      setConnectionStatus('error')
    }
  }

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setConnectionStatus('disconnected')
    fetchStockList()
  }

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  const isConnected = connectionStatus === 'connected'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Stock Monitor
                </h1>
                <p className="text-sm text-gray-600">リアルタイム株価監視システム</p>
              </div>
            </div>

            {/* Connection Status */}
            <ConnectionStatusIndicator status={connectionStatus} />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-4">
            <Button
              onClick={connect}
              disabled={isConnected || connectionStatus === 'connecting'}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6"
            >
              {connectionStatus === 'connecting' ? '接続中...' : '接続'}
            </Button>
            <Button
              onClick={disconnect}
              disabled={connectionStatus === 'disconnected'}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 px-6"
            >
              切断
            </Button>

            {stocks.length > 0 && connectionStatus === 'connected' && (
              <div className="ml-4 text-sm text-gray-600">
                <span className="font-medium">{stocks.length}</span> 銘柄を監視中
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <StockBoard stocks={stocks} />
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center text-sm text-gray-500">
            <p>Stock Monitor - リアルタイム株価監視システム</p>
            <p className="mt-1">データはシミュレーションです • Server-Sent Events (SSE) を使用</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App