export interface Stock {
  symbol: string
  name: string
  basePrice: number
  currentPrice: number
  changePercent: number
  lastUpdate: string
}

export interface StockUpdate {
  timestamp: string
  stocks: Stock[]
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'