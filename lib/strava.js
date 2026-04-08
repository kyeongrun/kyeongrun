async function getAccessToken() {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  })
  const json = await res.json()
  if (!json.access_token) throw new Error('Strava token error: ' + JSON.stringify(json))
  return json.access_token
}

export async function getActivities(perPage = 100) {
  const token = await getAccessToken()
  const res = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}`,
    { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 300 } }
  )
  const data = await res.json()
  return data.filter((a) => a.type === 'Run' || a.sport_type === 'Run')
}

export async function getActivity(id) {
  const token = await getAccessToken()
  const res = await fetch(
    `https://www.strava.com/api/v3/activities/${id}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  )
  return res.json()
}
