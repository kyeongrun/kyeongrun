import { getActivity } from '../../../../../lib/strava'

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatPace(movingTime, distance) {
  if (!distance || distance < 100) return null
  const secPerKm = (movingTime / distance) * 1000
  const m = Math.floor(secPerKm / 60)
  const s = Math.round(secPerKm % 60)
  return { str: `${m}'${String(s).padStart(2, '0')}"`, seconds: Math.round(secPerKm) }
}

export async function GET(_, context) {
  try {
    const { id } = await context.params
    const a = await getActivity(id)

    const pace = formatPace(a.moving_time, a.distance)

    const splits = (a.splits_metric ?? []).map((s) => {
      const p = formatPace(s.moving_time, s.distance)
      return { km: s.split, paceStr: p?.str ?? '-', paceSeconds: p?.seconds ?? 0 }
    })

    const avgPaceSeconds = pace?.seconds ?? 0

    return Response.json({
      id: a.id,
      name: a.name,
      date: a.start_date_local?.slice(0, 10) ?? a.start_date.slice(0, 10),
      distance: +(a.distance / 1000).toFixed(2),
      time: formatTime(a.moving_time),
      pace: pace?.str ?? '-',
      avgPaceSeconds,
      elevation: Math.round(a.total_elevation_gain ?? 0),
      avgHr: a.average_heartrate ? Math.round(a.average_heartrate) : null,
      maxHr: a.max_heartrate ? Math.round(a.max_heartrate) : null,
      calories: a.calories ? Math.round(a.calories) : null,
      splits,
      polyline: a.map?.summary_polyline ?? null,
    })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
