import { Stock } from '@/types/stock'
import { cn } from '@/lib/utils'

interface StockCardProps {
  stock: Stock
}

export function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.changePercent >= 0
  const isDisconnected = stock.currentPrice === 0
  const changeColor = isDisconnected ? 'text-gray-500' : (isPositive ? 'text-emerald-600' : 'text-red-600')
  const bgColor = isDisconnected ? 'bg-gray-50' : (isPositive ? 'bg-emerald-50' : 'bg-red-50')
  const borderColor = isDisconnected ? 'border-gray-200' : (isPositive ? 'border-emerald-200' : 'border-red-200')

  const formatPrice = (price: number) => price === 0 ? '-' : `$${price.toFixed(2)}`
  const formatChange = (change: number) => {
    if (change === 0) return '-'
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(2)}%`
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg",
      bgColor,
      borderColor
    )}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm px-4 py-3 border-b border-gray-200/50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{stock.symbol}</h3>
            <p className="text-sm text-gray-600 truncate">{stock.name}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-gray-900">
              {formatPrice(stock.currentPrice)}
            </div>
            <div className={cn("text-sm font-semibold", changeColor)}>
              {formatChange(stock.changePercent)}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">基準価格</span>
          <span className="font-mono font-medium">{formatPrice(stock.basePrice)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">価格差</span>
          <span className={cn("font-mono font-medium", changeColor)}>
            {stock.currentPrice === 0 ? '-' : formatPrice(stock.currentPrice - stock.basePrice)}
          </span>
        </div>

        <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-200/50">
          <span>最終更新</span>
          <span className="font-mono">{formatTime(stock.lastUpdate)}</span>
        </div>
      </div>

      {/* Animated indicator */}
      <div className="absolute top-0 right-0 w-1 h-full">
        <div className={cn(
          "w-full h-full transition-all duration-1000",
          isDisconnected ? "bg-gray-400" : (isPositive ? "bg-emerald-500" : "bg-red-500")
        )} />
      </div>
    </div>
  )
}