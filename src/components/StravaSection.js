'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const StravaMap = dynamic(() => import('./StravaMap'), { ssr: false })

const DOW = ['월', '화', '수', '목', '금', '토', '일']

function getMoodEmoji(km) {
  if (km >= 150) return { face: '🔥', label: '불타는 중' }
  if (km >= 100) return { face: '😎', label: '잘하고 있어' }
  if (km >= 60)  return { face: '😄', label: '순항 중' }
  if (km >= 25)  return { face: '🙂', label: '조금 더' }
  return { face: '😴', label: '일어나야 해' }
}

function calcMileage(activityDates) {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const day = now.getDay() || 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - day + 1)
  monday.setHours(0, 0, 0, 0)
  let monthKm = 0, weekKm = 0
  activityDates.forEach(({ date, km }) => {
    if (date.startsWith(`${yyyy}-${mm}`)) monthKm += km
    if (new Date(date) >= monday) weekKm += km
  })
  return { monthKm: +monthKm.toFixed(1), weekKm: +weekKm.toFixed(1) }
}

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDow = (firstDay.getDay() + 6) % 7
  const days = []
  for (let i = 0; i < startDow; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d)
  while (days.length % 7 !== 0) days.push(null)
  return days
}

export default function StravaSection() {
  const [data, setData] = useState(null)
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetch('/api/strava')
      .then((r) => r.json())
      .then((json) => { if (!json.error) setData(json) })
  }, [])

  async function openDetail(id) {
    setSelectedId(id); setDetail(null); setDetailLoading(true)
    const res = await fetch(`/api/strava/${id}`)
    setDetail(await res.json())
    setDetailLoading(false)
  }
  function closeDetail() { setSelectedId(null); setDetail(null) }

  const now = new Date()
  const isCurrentMonth = month.year === now.getFullYear() && month.month === now.getMonth()
  function prevMonth() {
    setMonth(({ year, month: m }) => m === 0 ? { year: year - 1, month: 11 } : { year, month: m - 1 })
  }
  function nextMonth() {
    if (isCurrentMonth) return
    setMonth(({ year, month: m }) => m === 11 ? { year: year + 1, month: 0 } : { year, month: m + 1 })
  }

  const dateMap = {}
  data?.activityDates?.forEach(({ date, km, id }) => { dateMap[date] = { km, id } })
  const calDays = getCalendarDays(month.year, month.month)
  const { monthKm, weekKm } = data ? calcMileage(data.activityDates) : { monthKm: 0, weekKm: 0 }
  const { face, label } = getMoodEmoji(monthKm)

  return (
    <div className="flex flex-col gap-4">

      {/* 상단: 프로필 카드 | 달력 — 가로 2분할 */}
      <div className="grid grid-cols-2 gap-4">

        {/* 프로필 카드 */}
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{face}</span>
            <div>
              <p className="text-sm font-bold text-gray-900">김경런</p>
              <p className="text-[10px] text-gray-400">{label}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-[#FAF7F2] rounded-lg p-2 text-center">
              <p className="text-[9px] text-gray-400">이번 달</p>
              <p className="text-base font-bold text-[#FC4C02]">{data ? `${monthKm}km` : '-'}</p>
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-2 text-center">
              <p className="text-[9px] text-gray-400">이번 주</p>
              <p className="text-base font-bold text-gray-700">{data ? `${weekKm}km` : '-'}</p>
            </div>
          </div>
        </div>

        {/* 달력 */}
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <button onClick={prevMonth} className="text-gray-400 hover:text-gray-700 w-5 text-center text-sm">‹</button>
            <span className="text-[11px] font-bold text-gray-700">
              {month.year}.{String(month.month + 1).padStart(2, '0')}
            </span>
            <button onClick={nextMonth}
              className={`w-5 text-center text-sm ${isCurrentMonth ? 'text-gray-200 cursor-default' : 'text-gray-400 hover:text-gray-700'}`}>›</button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {DOW.map((d) => <div key={d} className="text-center text-[8px] text-gray-400 font-medium">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {calDays.map((day, i) => {
              if (!day) return <div key={i} />
              const dateStr = `${month.year}-${String(month.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const activity = dateMap[dateStr]
              const isToday = dateStr === now.toISOString().slice(0, 10)
              return (
                <div key={i} onClick={() => activity && openDetail(activity.id)}
                  className={`flex flex-col items-center py-0.5 rounded ${activity ? 'cursor-pointer hover:bg-orange-50' : ''}`}>
                  <span className={`text-[9px] leading-tight flex items-center justify-center
                    ${isToday ? 'bg-black text-white rounded-full w-4 h-4 text-[8px]' : ''}
                    ${activity && !isToday ? 'font-bold text-[#FC4C02]' : ''}
                    ${!activity && !isToday ? 'text-gray-400' : ''}`}>
                    {day}
                  </span>
                  {activity && <span className="text-[7px] text-orange-400 leading-none">{activity.km}</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 누적 기록 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-xs font-bold text-gray-800 mb-3">📊 누적 기록</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: '총 거리', value: data ? `${data.totalKm}km` : '-' },
            { label: '총 횟수', value: data ? `${data.totalRuns}회` : '-' },
            { label: '총 고도', value: data ? `${data.totalElevation}m` : '-' },
          ].map((s) => (
            <div key={s.label} className="bg-[#FAF7F2] rounded-lg p-2 text-center">
              <p className="text-[9px] text-gray-400">{s.label}</p>
              <p className="text-sm font-bold text-gray-800">{s.value}</p>
            </div>
          ))}
        </div>
        {data?.monthly && (() => {
          const maxKm = Math.max(...data.monthly.map((x) => x.km), 1)
          const BAR_H = 64 // px
          const thisMonth = new Date().toISOString().slice(0, 7)
          const sorted = [...data.monthly].reverse()
          return (
            <>
              <div className="flex items-end gap-1 mb-1" style={{ height: BAR_H }}>
                {sorted.map((m) => {
                  const px = Math.max((m.km / maxKm) * BAR_H, 3)
                  const isThis = m.month === thisMonth
                  return (
                    <div key={m.month} className="flex-1 flex flex-col justify-end h-full relative">
                      <span className="text-[7px] text-gray-500 text-center leading-tight">{m.km}km</span>
                      <span className="text-[6px] text-gray-400 text-center leading-tight mb-0.5">{m.count}회</span>
                      <div
                        className={`w-full rounded-t ${isThis ? 'bg-[#FC4C02]' : 'bg-orange-200'}`}
                        style={{ height: px }}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-1">
                {sorted.map((m) => (
                  <div key={m.month} className="flex-1 text-center text-[7px] text-gray-400">
                    {m.month.slice(5)}월
                  </div>
                ))}
              </div>
            </>
          )
        })()}
      </div>

      {/* 하단: 최근 러닝 — 전체 폭 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-800 mb-3">🏃 최근 러닝</h2>
        {!data ? (
          <p className="text-xs text-gray-400 text-center py-4">불러오는 중...</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6">
            {data.recent.map((run) => (
              <div key={run.id} onClick={() => openDetail(run.id)}
                className="border-b py-2.5 cursor-pointer hover:bg-orange-50 rounded px-1 -mx-1 transition">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-semibold text-gray-800 truncate">{run.name}</p>
                  <p className="text-[10px] text-gray-400 shrink-0">{run.date}</p>
                </div>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-xs font-bold text-[#FC4C02]">{run.distance}km</span>
                  <span className="text-[10px] text-gray-500">{run.time}</span>
                  <span className="text-[10px] text-gray-500">{run.pace}/km</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {selectedId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeDetail}>
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {detailLoading && <div className="py-16 text-center text-gray-400 text-sm">불러오는 중...</div>}
            {detail && (
              <div className="p-5">
                <StravaMap polyline={detail.polyline} />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{detail.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{detail.date}</p>
                  </div>
                  <button onClick={closeDetail} className="text-gray-300 hover:text-gray-600 text-2xl leading-none ml-2">×</button>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { label: '거리', value: `${detail.distance}km` },
                    { label: '시간', value: detail.time },
                    { label: '페이스', value: `${detail.pace}/km` },
                    { label: '고도', value: `${detail.elevation}m` },
                    detail.avgHr ? { label: '평균 심박', value: `${detail.avgHr}bpm` } : null,
                    detail.calories ? { label: '칼로리', value: `${detail.calories}kcal` } : null,
                  ].filter(Boolean).map((s) => (
                    <div key={s.label} className="bg-[#FAF7F2] rounded-xl p-2.5 text-center">
                      <p className="text-[10px] text-gray-400 mb-0.5">{s.label}</p>
                      <p className="text-sm font-bold text-gray-800">{s.value}</p>
                    </div>
                  ))}
                </div>
                {detail.splits?.length > 0 && (() => {
                  const validSplits = detail.splits.filter((s) => s.paceSeconds > 0)
                  const bestPace = Math.min(...validSplits.map((s) => s.paceSeconds))
                  const worstPace = Math.max(...validSplits.map((s) => s.paceSeconds))
                  const range = worstPace - bestPace || 1

                  return (
                    <>
                      <h4 className="text-xs font-bold text-gray-700 mb-1">km 스플릿</h4>
                      <p className="text-[9px] text-gray-400 mb-2">
                        최고 {detail.splits.find((s) => s.paceSeconds === bestPace)?.paceStr} 기준
                      </p>
                      <div className="flex flex-col gap-2">
                        {detail.splits.map((s) => {
                          const diffSec = s.paceSeconds - bestPace
                          const isBest = diffSec === 0
                          // 바 너비: 최고=100%, 최저=20%
                          const barWidth = 100 - ((diffSec / range) * 80)
                          const color = isBest
                            ? 'bg-green-400'
                            : diffSec <= 10 ? 'bg-[#FC4C02]'
                            : diffSec <= 30 ? 'bg-yellow-400'
                            : 'bg-red-400'

                          const diffLabel = isBest
                            ? '최고'
                            : `+${Math.floor(diffSec / 60) > 0 ? Math.floor(diffSec / 60) + 'm' : ''}${diffSec % 60}s`

                          return (
                            <div key={s.km}>
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[10px] text-gray-500 font-medium">{s.km}km</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] font-semibold ${isBest ? 'text-green-500' : diffSec <= 10 ? 'text-orange-400' : diffSec <= 30 ? 'text-yellow-500' : 'text-red-400'}`}>
                                    {diffLabel}
                                  </span>
                                  <span className="text-[10px] font-bold text-gray-700 w-12 text-right">{s.paceStr}</span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className={`h-2 rounded-full transition-all ${color}`}
                                  style={{ width: `${barWidth}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <p className="text-[9px] text-gray-400 mt-2">초록 = 최고 페이스 · 주황 ±10s · 노랑 ±30s · 빨강 그 이상</p>
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
