'use client'

import { useEffect, useState } from 'react'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000 / 60
  if (diff < 60) return `${Math.floor(diff)}분 전`
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`
  return `${Math.floor(diff / 1440)}일 전`
}

function NewsList({ title, icon, items, loading }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <h2 className="text-sm font-bold text-gray-800">{icon} {title}</h2>
      {loading && <p className="text-xs text-gray-400 text-center py-6">불러오는 중...</p>}
      {!loading && items.length === 0 && <p className="text-xs text-gray-400 text-center py-6">뉴스 없음</p>}
      <div className="flex flex-col divide-y">
        {items.map((item, i) => (
          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
            className="py-2.5 first:pt-1 last:pb-0 hover:bg-orange-50 rounded px-1 -mx-1 transition group">
            <p className="text-xs font-medium text-gray-800 leading-snug group-hover:text-[#FC4C02] transition line-clamp-3">
              {item.title}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              {item.source && <span className="text-[10px] text-gray-400">{item.source}</span>}
              {item.date && <span className="text-[10px] text-gray-300">· {timeAgo(item.date)}</span>}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default function NewsSection() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/news')
      .then((r) => r.json())
      .then((json) => { if (!json.error) setData(json) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="grid grid-cols-2 gap-4 items-start">
      <NewsList title="IREN" icon="🏢" items={data?.iren ?? []} loading={loading} />
      <NewsList title="비트코인" icon="₿" items={data?.btc ?? []} loading={loading} />
    </div>
  )
}
