'use client'

import { useState } from 'react'
import Link from 'next/link'
import StravaSection from './StravaSection'
import NewsSection from './NewsSection'

const TABS = [
  { key: 'running', label: '🏃 러닝' },
  { key: 'posts',   label: '📝 글' },
  { key: 'news',    label: '📰 뉴스' },
]

export default function HomeContent({ posts }) {
  const [tab, setTab] = useState('posts')

  return (
    <>
      {/* ── 모바일 탭 (md 미만) ── */}
      <div className="md:hidden">
        <div className="flex border-b bg-white sticky top-0 z-10">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-3 text-sm font-semibold transition
                ${tab === t.key
                  ? 'text-[#FC4C02] border-b-2 border-[#FC4C02]'
                  : 'text-gray-400'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="px-4 py-5">
          {tab === 'running' && <StravaSection />}

          {tab === 'posts' && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-800">최근 글</h2>
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="bg-white border rounded-xl p-5 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#71D980] bg-[#f0fdf2] px-2 py-1 rounded-full">
                      {post.tag}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">{post.title}</h3>
                  {post.tag === '러닝기록' ? (
                    <p className="text-gray-500 text-sm">{post.distance}km • {post.time} • {post.pace}</p>
                  ) : (
                    <p className="text-gray-500 text-sm">{post.description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}

          {tab === 'news' && <NewsSection />}
        </div>
      </div>

      {/* ── 데스크탑 3컬럼 (md 이상) ── */}
      <div className="hidden md:grid flex-1 w-full max-w-screen-xl mx-auto px-4 py-8 grid-cols-6 gap-5 items-start">
        <aside className="col-span-2">
          <StravaSection />
        </aside>

        <section className="col-span-2 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-800">최근 글</h2>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="bg-white border rounded-xl p-5 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#71D980] bg-[#f0fdf2] px-2 py-1 rounded-full">
                  {post.tag}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">{post.title}</h3>
              {post.tag === '러닝기록' ? (
                <p className="text-gray-500 text-sm">{post.distance}km • {post.time} • {post.pace}</p>
              ) : (
                <p className="text-gray-500 text-sm">{post.description}</p>
              )}
            </Link>
          ))}
        </section>

        <aside className="col-span-2">
          <NewsSection />
        </aside>
      </div>
    </>
  )
}
