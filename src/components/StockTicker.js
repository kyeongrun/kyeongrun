'use client'

import { useEffect, useState } from 'react'

/* ─── 가격 포맷 ─── */
function formatPrice(symbol, price) {
  if (price == null) return '-'
  if (symbol === 'BTC-USD') {
    return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 })
  }
  if (symbol === '005930.KS') {
    return '₩' + price.toLocaleString('ko-KR', { maximumFractionDigits: 0 })
  }
  return '$' + price.toFixed(2)
}

function formatChange(symbol, change, changePercent, sign) {
  if (symbol === '005930.KS') {
    const c = change != null ? Math.round(change).toLocaleString('ko-KR') : '0'
    const p = changePercent?.toFixed(2) ?? '0.00'
    return `${sign}${c} (${sign}${p}%)`
  }
  return `${sign}${change?.toFixed(2)} (${sign}${changePercent?.toFixed(2)}%)`
}

/* ─── 마켓 배지 ─── */
function MarketBadge({ state }) {
  if (!state) return null
  const map = {
    PRE:     <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300">프리장</span>,
    REGULAR: <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-300">정규장</span>,
    POST:    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">애프터</span>,
  }
  return map[state] ?? <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gray-500/20 text-gray-400">마감</span>
}

/* ─── 로고 SVG ─── */
function SamsungLogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      <circle cx="19" cy="19" r="19" fill="#1428A0" />
      <text x="19" y="25.5" textAnchor="middle" fill="white"
        fontSize="21" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900">
        S
      </text>
    </svg>
  )
}

function IrenLogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      <circle cx="19" cy="19" r="19" fill="#0F172A" />
      <circle cx="19" cy="19" r="18" stroke="#22D3EE" strokeWidth="1.2" />
      {/* 번개 모양 */}
      <path d="M22 9L14 21h7l-3 9 10-14h-7l3-7z" fill="#22D3EE" />
    </svg>
  )
}

function BitcoinLogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      <circle cx="19" cy="19" r="19" fill="#F7931A" />
      <text x="20.5" y="25.5" textAnchor="middle" fill="white"
        fontSize="20" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900">
        ₿
      </text>
    </svg>
  )
}

/* ─── 카드별 설정 ─── */
const CONFIGS = {
  '005930.KS': {
    label: '삼성전자',
    sub: 'KRX · 005930',
    Logo: SamsungLogo,
    border: 'border-[#1428A0]/40',
    glow: 'shadow-[0_0_12px_rgba(20,40,160,0.25)]',
  },
  IREN: {
    label: 'IREN',
    sub: 'NASDAQ',
    Logo: IrenLogo,
    border: 'border-cyan-500/30',
    glow: 'shadow-[0_0_12px_rgba(34,211,238,0.15)]',
  },
  'BTC-USD': {
    label: 'Bitcoin',
    sub: 'BTC / USD',
    Logo: BitcoinLogo,
    border: 'border-orange-400/30',
    glow: 'shadow-[0_0_12px_rgba(247,147,26,0.2)]',
  },
}

/* ─── 메인 컴포넌트 ─── */
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
        const color = isUp ? 'text-[#4ADE80]' : 'text-red-400'
        const sign = isUp ? '+' : ''
        const cfg = CONFIGS[item.symbol] ?? {
          label: item.symbol,
          sub: '',
          Logo: () => <span className="text-2xl">📈</span>,
          border: 'border-white/10',
          glow: '',
        }
        const { label, sub, Logo, border, glow } = cfg
        const isBTC = item.symbol === 'BTC-USD'
        const isSamsung = item.symbol === '005930.KS'

        return (
          <div
            key={item.symbol}
            className={`flex items-center gap-4 bg-white/[0.07] backdrop-blur-sm border ${border} ${glow} rounded-2xl px-5 py-4 min-w-[200px]`}
          >
            {/* 로고 */}
            <Logo />

            {/* 정보 */}
            <div className="flex flex-col">
              {/* 종목명 + 배지 */}
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-white font-extrabold text-[15px] tracking-tight leading-none">
                  {label}
                </span>
                {!isBTC && !isSamsung && <MarketBadge state={item.marketState} />}
              </div>

              {/* 거래소 */}
              <span className="text-[10px] text-gray-500 font-medium mb-2 leading-none">
                {sub}
              </span>

              {/* 현재가 */}
              <span className="text-white font-black text-xl leading-tight tracking-tight">
                {formatPrice(item.symbol, item.price)}
              </span>

              {/* 변동 */}
              <span className={`text-[11px] font-semibold mt-1 ${color}`}>
                {formatChange(item.symbol, item.change, item.changePercent, sign)}
              </span>
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
