'use client'
// 'use client' : 버튼 클릭, 입력 등 사용자 interaction이 있으면 필요해요

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  // password : 입력한 비밀번호 상태
  const [error, setError] = useState('')
  // error : 비밀번호 틀렸을 때 메시지 상태
  const router = useRouter()
  // router : 페이지 이동에 사용

  async function handleLogin() {
    // 입력한 비밀번호를 서버에 확인 요청
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
      // JSON.stringify : 객체를 JSON 문자열로 변환
    })

    if (res.ok) {
      router.push('/admin/dashboard')
      // 비밀번호 맞으면 대시보드로 이동
    } else {
      setError('비밀번호가 틀렸어요.')
      // 비밀번호 틀리면 에러 메시지 표시
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">관리자 로그인</h1>

        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          // Enter 키 눌러도 로그인 되도록
          className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
          // 에러 메시지 (틀렸을 때만 표시)
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          로그인
        </button>
      </div>
    </main>
  )
}
