import { getActivities } from '../../../../lib/strava'

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatPace(seconds, meters) {
  if (!meters) return '-'
  const secPerKm = (seconds / meters) * 1000
  const m = Math.floor(secPerKm / 60)
  const s = Math.round(secPerKm % 60)
  return `${m}'${String(s).padStart(2, '0')}"`
}

export async function GET() {
  try {
    const runs = await getActivities(200)

    // 최근 10개 활동
    const recent = runs.slice(0, 10).map((a) => ({
      id: a.id,
      name: a.name,
      distance: +(a.distance / 1000).toFixed(2),
      time: formatTime(a.moving_time),
      pace: formatPace(a.moving_time, a.distance),
      date: a.start_date_local?.slice(0, 10) ?? a.start_date.slice(0, 10),
    }))

    // 날짜별 km (달력용)
    const dateMap = {}
    runs.forEach((a) => {
      const date = a.start_date_local?.slice(0, 10) ?? a.start_date.slice(0, 10)
      const km = +(a.distance / 1000).toFixed(2)
      if (!dateMap[date]) dateMap[date] = { km: 0, id: a.id }
      dateMap[date].km = +(dateMap[date].km + km).toFixed(2)
    })
    const activityDates = Object.entries(dateMap).map(([date, v]) => ({ date, ...v }))

    // 전체 누적
    const totalKm = +runs.reduce((s, a) => s + a.distance / 1000, 0).toFixed(1)
    const totalRuns = runs.length
    const totalSeconds = runs.reduce((s, a) => s + a.moving_time, 0)
    const totalElevation = Math.round(runs.reduce((s, a) => s + (a.total_elevation_gain ?? 0), 0))

    // 월별 누적 — 있는 달만
    const monthMap = {}
    runs.forEach((a) => {
      const date = a.start_date_local?.slice(0, 10) ?? a.start_date.slice(0, 10)
      const key = date.slice(0, 7) // YYYY-MM
      if (!monthMap[key]) monthMap[key] = { km: 0, count: 0, seconds: 0 }
      monthMap[key].km      += a.distance / 1000
      monthMap[key].count   += 1
      monthMap[key].seconds += a.moving_time
    })

    const monthly = Object.entries(monthMap)
      .sort(([a], [b]) => b.localeCompare(a)) // 최신 순
      .slice(0, 12)                            // 최근 12개월
      .map(([month, v]) => ({
        month,
        km: +v.km.toFixed(1),
        count: v.count,
        time: formatTime(v.seconds),
      }))

    return Response.json({ recent, activityDates, totalKm, totalRuns, totalSeconds, totalElevation, monthly })
  } catch (e) {
    console.error('[strava]', e.message)
    return Response.json({ error: e.message }, { status: 500 })
  }
}
