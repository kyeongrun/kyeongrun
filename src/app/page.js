import { getAllPosts } from "../../lib/posts";
// 방금 만든 lib/posts.js 에서 getAllPosts 함수를 가져와요
// src/app/page.js 기준으로 lib 폴더가 두 단계 위에 있어서 ../../ 예요

export default function Home() {
  const posts = getAllPosts();
  // getAllPosts 함수를 실행해서 posts 폴더의 모든 글을 가져와요

  return (
    <main className="min-h-screen bg-gray-50">

      {/* 헤더 */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏃</span>
          <span className="font-bold text-xl text-gray-800">김경런</span>
        </div>
        <nav className="flex gap-6 text-sm text-gray-500">
          <a href="/" className="hover:text-black transition">홈</a>
          <a href="/about" className="hover:text-black transition">소개</a>
        </nav>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-black text-white px-6 py-20 text-center">
        <p className="text-orange-400 font-semibold mb-3 tracking-widest text-sm">RUNNING BLOG</p>
        <h1 className="text-4xl font-bold mb-4">달리는 김경런</h1>
        <p className="text-gray-400 text-lg">러닝 기록, 훈련 플랜, 장비 리뷰까지</p>
      </section>

      {/* 글 목록 */}
      <section className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">최근 글</h2>
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <a
              key={post.slug}
              // slug = Markdown 파일명 기반의 고유 ID예요 (first-run 등)
              href={`/posts/${post.slug}`}
              // 클릭하면 /posts/first-run 같은 상세 페이지로 이동해요
              className="bg-white border rounded-xl p-6 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                  {post.tag}
                  {/* Markdown 메타데이터의 tag 값이에요 */}
                </span>
                <span className="text-xs text-gray-400">{post.date}</span>
                {/* Markdown 메타데이터의 date 값이에요 */}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{post.title}</h3>
              {/* Markdown 메타데이터의 title 값이에요 */}

              {/* 러닝기록 태그인 경우 distance, time, pace 표시 */}
              {post.tag === "러닝기록" ? (
                <p className="text-gray-500 text-sm">
                  {post.distance} • {post.time} • {post.pace}
                  {/* Markdown 메타데이터의 distance, time, pace 값이에요 */}
                </p>
              ) : (
                <p className="text-gray-500 text-sm">{post.description}</p>
                // 러닝기록이 아닌 경우 description 을 표시해요
              )}
            </a>
          ))}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="text-center text-gray-400 text-sm py-8">
        © 2026 김경런 · kimkyeong.run
      </footer>

    </main>
  )
}