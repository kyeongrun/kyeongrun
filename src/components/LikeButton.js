'use client'

import { useState } from 'react'

export default function LikeButton({ slug, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes)
  // likes : 현재 좋아요 수 상태
  const [liked, setLiked] = useState(false)
  // liked : 이미 눌렀는지 여부

  async function handleLike() {
    if (liked) return
    // 이미 눌렀으면 중복 방지

    setLikes(likes + 1)
    // 화면에 바로 +1 반영 (빠른 반응)
    setLiked(true)
    // 버튼 비활성화

    await fetch(`/api/posts/${slug}/likes`, { method: 'POST' })
    // DB 에도 +1
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className={`flex items-center gap-1 text-sm transition
        ${liked
          ? 'text-red-400 cursor-default'
          : 'text-gray-400 hover:text-red-400'
        }`}
      // liked 상태에 따라 색상 변경
    >
      {liked ? '❤️' : '🤍'} {likes}
    </button>
  )
}
