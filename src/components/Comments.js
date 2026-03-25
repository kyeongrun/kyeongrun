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
          const contentHeight = iframe.contentDocument.body.scrollHeight
          thread.setAttribute('style', `height: ${contentHeight}px !important; overflow-y: scroll !important;`)
          // ✅ 액자 크기 500px → 너무 크거나 작으면 숫자 조절
          iframe.setAttribute('style', `width: 100% !important; height: ${contentHeight}px  !important;`)
          // ✅ iframe은 액자보다 2배 크게 → 스크롤할 내용 생김
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
    <div>
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