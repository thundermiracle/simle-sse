import { Stock } from '@/types/stock'
import { StockCard } from './StockCard'

interface StockBoardProps {
  stocks: Stock[]
}

export function StockBoard({ stocks }: StockBoardProps) {
  if (stocks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          株価データがありません
        </h3>
        <p className="text-gray-500">
          「接続」ボタンをクリックして、リアルタイム株価データの受信を開始してください
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          リアルタイム株価ボード
        </h2>
        <p className="text-gray-600">
          {stocks.length}銘柄の株価を監視中
        </p>
      </div>

      {/* Stock grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            stock={stock}
          />
        ))}
      </div>

      {/* Footer info */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          価格は1秒ごとに更新されます • データはシミュレーションです
        </p>
        {stocks.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            最終更新: {new Date(stocks[0]?.lastUpdate).toLocaleString('ja-JP')}
          </p>
        )}
      </div>
    </div>
  )
}