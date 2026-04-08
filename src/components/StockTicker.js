'use client'

import { useEffect, useState } from 'react'

function formatPrice(symbol, price) {
  if (price == null) return '-'
  if (symbol === 'BTC-USD') {
    return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 })
  }
  return '$' + price.toFixed(2)
}

function MarketBadge({ state }) {
  if (!state) return null
  if (state === 'PRE')     return <span className="text-[10px] font-semibold text-blue-300">프리장</span>
  if (state === 'REGULAR') return <span className="text-[10px] font-semibold text-green-300">정규장</span>
  if (state === 'POST')    return <span className="text-[10px] font-semibold text-yellow-300">애프터장</span>
  return <span className="text-[10px] font-semibold text-gray-400">마감</span>
}

export default function StockTicker() {
  const [items, setItems] = useState([])
  const [updatedAt, setUpdatedAt] = useState(null)

  async function fetchPrices() {
    try {
      const res = await fetch('/api/prices')
      const json = await res.json()
      if (json.data) {
        setItems(json.data)
        setUpdatedAt(new Date())
      }
    } catch {
      // silent fail
    }
  }

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 30_000)
    return () => clearInterval(interval)
  }, [])

  if (items.length === 0) return null

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-5">
      {items.map((item) => {
        const isUp = (item.changePercent ?? 0) >= 0
        const color = isUp ? 'text-[#71D980]' : 'text-red-400'
        const sign = isUp ? '+' : ''
        const face = isUp ? '😄' : '😢'

        const isBTC = item.symbol === 'BTC-USD'
        const headerLabel = isBTC ? '₿ BTC' : `📈 ${item.symbol}`

        return (
          <div
            key={item.symbol}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 min-w-[160px]"
          >
            <span className="text-3xl">{face}</span>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <p className="text-xs text-gray-400">{headerLabel}</p>
                {!isBTC && <MarketBadge state={item.marketState} />}
              </div>
              <p className="text-white font-bold text-lg leading-tight">
                {formatPrice(item.symbol, item.price)}
              </p>
              <p className={`text-xs font-medium mt-0.5 ${color}`}>
                {`${sign}${item.change?.toFixed(2)} (${sign}${item.changePercent?.toFixed(2)}%)`}
              </p>
            </div>
          </div>
        )
      })}
      {updatedAt && (
        <p className="w-full text-center text-[10px] text-gray-600 mt-1">
          {updatedAt.toLocaleTimeString('ko-KR')} 기준 · 30초마다 갱신
        </p>
      )}
    </div>
  )
}
