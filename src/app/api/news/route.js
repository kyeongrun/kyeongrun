function parseRSS(xml) {
  const items = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const titleMatch = block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || block.match(/<title>([\s\S]*?)<\/title>/)
    const linkMatch  = block.match(/<link>([\s\S]*?)<\/link>/)
    const dateMatch  = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
    const srcMatch   = block.match(/<source[^>]*>([\s\S]*?)<\/source>/)
    const title  = titleMatch?.[1]?.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim()
    const link   = linkMatch?.[1]?.trim()
    const date   = dateMatch?.[1]?.trim()
    const source = srcMatch?.[1]?.trim()
    if (title && link) items.push({ title, link, date, source })
  }
  return items
}

async function fetchRSS(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    next: { revalidate: 1800 },
  })
  if (!res.ok) throw new Error(`RSS ${res.status}`)
  return parseRSS(await res.text()).slice(0, 8)
}

export async function GET() {
  try {
    const [iren, btc] = await Promise.all([
      fetchRSS('IREN NASDAQ data center'),
      fetchRSS('bitcoin cryptocurrency'),
    ])
    return Response.json({ iren, btc })
  } catch (e) {
    console.error('[news]', e.message)
    return Response.json({ error: e.message }, { status: 500 })
  }
}
