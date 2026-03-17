'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  // posts : DB에서 가져온 글 목록 상태

  const [form, setForm] = useState({
    slug: '', title: '', content: '',
    tag: '', description: '',
    distance: '', time: '', pace: '',
    location: '', crew: '',
  })
  // form : 글쓰기 입력값 상태

  const [loading, setLoading] = useState(false)
  // loading : 저장 중일 때 버튼 비활성화용

  // 페이지 열릴 때 글 목록 불러오기
  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('id, slug, title, tag, created_at')
      .order('created_at', { ascending: false })
    setPosts(data || [])
  }

  // 입력값 변경 핸들러
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    // ...form : 기존 값 유지하면서 변경된 값만 업데이트
  }

  // 글 저장
  async function handleSubmit() {
    if (!form.slug || !form.title || !form.content) {
      alert('슬러그, 제목, 내용은 필수예요!')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('posts').insert({
      slug:        form.slug,
      title:       form.title,
      content:     form.content,
      tag:         form.tag,
      description: form.description,
      distance:    form.distance ? parseFloat(form.distance) : null,
      // parseFloat : 문자열 "10.5" → 숫자 10.5 로 변환
      time:        form.time || null,
      pace:        form.pace ? `${form.pace}/km` : null,
      location:    form.location || null,
      crew:        form.crew || null,
      published:   true,
    })

    if (error) {
      alert('저장 실패: ' + error.message)
    } else {
      alert('저장 완료!')
      setForm({
        slug: '', title: '', content: '',
        tag: '', description: '',
        distance: '', time: '', pace: '',
        location: '', crew: '',
      })
      // 저장 후 입력창 초기화
      fetchPosts()
      // 글 목록 새로고침
    }

    setLoading(false)
  }

  // 글 삭제
  async function handleDelete(id) {
    if (!confirm('정말 삭제할까요?')) return
    // confirm : 확인 팝업

    await supabase.from('posts').delete().eq('id', id)
    // id가 일치하는 글 삭제
    fetchPosts()
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">관리자 대시보드</h1>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-500 hover:underline"
          >
            블로그로 돌아가기
          </button>
        </div>

        {/* 글쓰기 폼 */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-10">
          <h2 className="text-lg font-bold mb-4">새 글 작성</h2>

          <div className="flex flex-col gap-3">

            {/* 슬러그 & 태그 */}
            <div className="flex gap-3">
              <input name="slug" value={form.slug} onChange={handleChange}
                placeholder="슬러그 (예: my-first-run)"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
                <select
                    name="tag"
                    value={form.tag}
                    onChange={handleChange}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                    // bg-white : select 기본 배경색이 회색인 브라우저가 있어서 명시
                >
                    <option value="">태그 선택</option>
                    {/* value="" : 아무것도 선택 안 한 기본 상태 */}
                    <option value="러닝기록">러닝기록</option>
                    <option value="훈련플랜">훈련플랜</option>
                    <option value="장비리뷰">장비리뷰</option>
                    <option value="대회후기">대회후기</option>
                    <option value="아무말">아무말</option>
                </select>
            </div>

            {/* 제목 */}
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="제목"
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            {/* 요약 */}
            <input name="description" value={form.description} onChange={handleChange}
              placeholder="글 요약 (러닝기록 아닌 글에 표시)"
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            {/* 러닝 정보 */}
            <div className="flex gap-3">
              <input name="distance" value={form.distance} onChange={handleChange}
                placeholder="거리 (예: 10.5)"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input name="time" value={form.time} onChange={handleChange}
                placeholder="시간 (예: 1:02:30)"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input name="pace" value={form.pace} onChange={handleChange}
                placeholder="페이스 (예: 6'14&quot;)"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* 장소 & 크루 */}
            <div className="flex gap-3">
              <input name="location" value={form.location} onChange={handleChange}
                placeholder="장소 (예: 한강공원)"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input name="crew" value={form.crew} onChange={handleChange}
                placeholder="크루원 (예: 김철수, 이영희)"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* 본문 */}
            <textarea name="content" value={form.content} onChange={handleChange}
              placeholder="본문 (마크다운으로 작성)"
              rows={10}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none font-mono"
              // font-mono : 마크다운 작성할 때 코드 폰트가 보기 편해요
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
              // disabled:opacity-50 : 저장 중일 때 버튼 흐리게
            >
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>

        {/* 글 목록 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">글 목록</h2>
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium text-sm">{post.title}</p>
                  <p className="text-xs text-gray-400">
                    {post.tag} · {new Date(post.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}