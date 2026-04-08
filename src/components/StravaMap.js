'use client'

import { useEffect, useRef } from 'react'

function decodePolyline(str) {
  let index = 0, lat = 0, lng = 0
  const coords = []
  while (index < str.length) {
    let shift = 0, result = 0, b
    do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lat += (result & 1) ? ~(result >> 1) : result >> 1
    shift = 0; result = 0
    do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lng += (result & 1) ? ~(result >> 1) : result >> 1
    coords.push([lat / 1e5, lng / 1e5])
  }
  return coords
}

export default function StravaMap({ polyline }) {
  const mapRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!polyline || !mapRef.current || instanceRef.current) return

    import('leaflet').then((L) => {
      // Next.js에서 leaflet 아이콘 경로 오류 방지
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const coords = decodePolyline(polyline)
      if (!coords.length) return

      const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map)

      const route = L.polyline(coords, { color: '#FC4C02', weight: 3.5, opacity: 0.9 }).addTo(map)

      // 출발점 · 도착점 마커
      L.circleMarker(coords[0], { radius: 5, color: '#22c55e', fillColor: '#22c55e', fillOpacity: 1, weight: 2 }).addTo(map)
      L.circleMarker(coords[coords.length - 1], { radius: 5, color: '#FC4C02', fillColor: '#FC4C02', fillOpacity: 1, weight: 2 }).addTo(map)

      map.fitBounds(route.getBounds(), { padding: [12, 12] })
      instanceRef.current = map
    })

    return () => {
      instanceRef.current?.remove()
      instanceRef.current = null
    }
  }, [polyline])

  if (!polyline) return null

  return (
    <>
      {/* leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} className="w-full h-44 rounded-xl overflow-hidden mb-4" />
    </>
  )
}
