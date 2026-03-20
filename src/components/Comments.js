'use client'

import { useEffect } from 'react'

export default function Comments({ pageId, pageTitle, pageUrl }) {

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cusdis.com/js/cusdis.es.js'
    script.async = true
    script.onload = () => {
      if (window.CUSDIS) {
        window.CUSDIS.renderTo(document.getElementById('cusdis_thread'))
      }

      const fixHeight = setInterval(() => {
        const iframe = document.querySelector('#cusdis_thread iframe')
        const thread = document.getElementById('cusdis_thread')

  if (iframe && thread) {
    // ✅ cusdis_thread div 자체에 높이 강제 설정
    thread.setAttribute('style', 'height: 1200px !important; overflow-y: scroll !important;')
    // ✅ iframe은 그 안을 꽉 채우게
    iframe.setAttribute('style', 'height: 100% !important; width: 100% !important; min-height: 1200px !important;')
    clearInterval(fixHeight)
  }
      }, 500)
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [pageId])

  return (
    <div className="p-6">
      {/* ✅ wrapper에 고정 높이 + 스크롤 적용 */}

        <div
          id="cusdis_thread"
          data-host="https://cusdis.com"
          data-app-id="5c7da254-c237-4f51-96cc-aa1f8cffba94"
          data-page-id={pageId}
          data-page-url={pageUrl}
          data-page-title={pageTitle}
          style={{ height: '100%' }}
          // ✅ cusdis_thread도 부모 높이 꽉 채우게
        />
      </div>
  )
}