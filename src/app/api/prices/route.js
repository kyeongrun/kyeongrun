function getUSMarketState() {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(now)

  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]))
  const day = p.weekday          // Mon, Tue ... Sat, Sun
  const mins = parseInt(p.hour) * 60 + parseInt(p.minute)

  if (day === 'Sat' || day === 'Sun') return 'CLOSED'
  if (mins < 240)  return 'CLOSED'   // ~04:00 이전
  if (mins < 570)  return 'PRE'      // 04:00 ~ 09:30
  if (mins < 960)  return 'REGULAR'  // 09:30 ~ 16:00
  if (mins < 1200) return 'POST'     // 16:00 ~ 20:00
  return 'CLOSED'
}

async function fetchIREN() {
  // includePrePost=true 로 프리/애프터장 데이터 포함
  const res = await fetch(
    'https://query1.finance.yahoo.com/v8/finance/chart/IREN?interval=5m&range=1d&includePrePost=true',
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: '*/*',
      },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    const text = await res.text()
    console.error('[prices] IREN fetch status:', res.status, text.slice(0, 200))
    throw new Error(`IREN fetch failed: ${res.status}`)
  }

  const json = await res.json()
  const result = json.chart?.result?.[0]
  const meta = result?.meta
  if (!meta) throw new Error('IREN meta not found')

  const marketState = getUSMarketState()
  const regularPrice = meta.regularMarketPrice
  const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? regularPrice

  // 마지막 유효 데이터 포인트 (프리/애프터 fallback)
  const closes = result?.indicators?.quote?.[0]?.close ?? []
  let lastDataPrice = regularPrice
  for (let i = closes.length - 1; i >= 0; i--) {
    if (closes[i] != null) { lastDataPrice = closes[i]; break }
  }

  let price = regularPrice
  if (marketState === 'PRE')  price = meta.preMarketPrice  ?? lastDataPrice
  if (marketState === 'POST') price = meta.postMarketPrice ?? lastDataPrice

  // 애프터장은 당일 정규 종가 대비, 나머지는 전일 종가 대비
  const basePrice = marketState === 'POST' ? regularPrice : prevClose
  const change = price - basePrice
  const changePercent = (change / basePrice) * 100

  return { symbol: 'IREN', price, change, changePercent, marketState }
}

async function fetchBTC() {
  const res = await fetch(
    'https://query1.finance.yahoo.com/v8/finance/chart/BTC-USD?interval=1d&range=5d',
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: '*/*',
      },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    console.error('[prices] BTC fetch status:', res.status)
    throw new Error(`BTC fetch failed: ${res.status}`)
  }

  const json = await res.json()
  const meta = json.chart?.result?.[0]?.meta
  if (!meta) throw new Error('BTC meta not found')

  const price = meta.regularMarketPrice
  const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price
  const change = price - prevClose
  const changePercent = (change / prevClose) * 100

  return { symbol: 'BTC-USD', price, change, changePercent }
}

export async function GET() {
  const results = await Promise.allSettled([fetchIREN(), fetchBTC()])

  const data = results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value)

  const errors = results
    .filter((r) => r.status === 'rejected')
    .map((r) => r.reason?.message)

  if (errors.length) console.error('[prices] errors:', errors)

  if (data.length === 0) {
    return Response.json({ error: errors.join(', ') }, { status: 500 })
  }

  return Response.json({ data })
}
