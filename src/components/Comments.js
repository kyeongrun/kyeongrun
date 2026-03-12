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

      // iframe이 생성된 후 높이를 강제로 늘림
      const fixHeight = setInterval(() => {
        // setInterval : 0.5초마다 아래 코드를 반복 실행
        const iframe = document.querySelector('#cusdis_thread iframe')
        // cusdis_thread 안의 iframe을 찾음

        if (iframe) {
          iframe.style.height = '500px'
          // iframe 높이를 500px로 강제 설정
          // 숫자를 늘리면 더 크게 보여요 (600px, 700px 등)
          clearInterval(fixHeight)
          // iframe을 찾으면 반복 실행 중단
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
      <div
        id="cusdis_thread"
        data-host="https://cusdis.com"
        data-app-id="5c7da254-c237-4f51-96cc-aa1f8cffba94"
        data-page-id={pageId}
        data-page-url={pageUrl}
        data-page-title={pageTitle}
      />
    </div>
  )
}