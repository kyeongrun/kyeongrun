'use client'

import { useEffect } from 'react'

export default function ViewCounter({ slug, initialViews }) {
  useEffect(() => {
    // 페이지 열릴 때 조회수 +1 API 호출
    fetch(`/api/posts/${slug}/views`, { method: 'POST' })
  }, [slug])
  // [slug] : slug 가 바뀔 때만 실행

  return (
    <span className="text-sm text-gray-400">
      👁️ {initialViews}
    </span>
  )
}