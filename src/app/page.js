import { getAllPosts } from "../../lib/posts";
import Link from "next/link";

export const dynamic = 'force-dynamic'; // 이 페이지는 항상 서버에서 렌더링

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main className="h-full flex flex-col bg-[#FAF7F2]">

      {/* 히어로 섹션 */}
      <section className="shrink-0 bg-black text-white px-6 py-10 text-center">
        {/* shrink-0 : 히어로 높이 고정 */}
        {/* py-20 → py-10 : 높이 살짝 줄이기 */}
        <p className="text-[#71D980] font-semibold mb-3 tracking-widest text-sm">RUNNING BLOG</p>
        <h1 className="text-4xl font-bold mb-4">I RUN - 나는 달린다.</h1>
        <p className="text-gray-400 text-lg">러닝 기록, 훈련 플랜, 장비 리뷰까지</p>
      </section>

      {/* 글 목록 - 남은 공간 차지 + 내부만 스크롤 */}
      <section className="flex-1 overflow-hidden px-4 py-6">
        <div className="max-w-2xl mx-auto h-full flex flex-col">
          <h2 className="shrink-0 text-xl font-bold text-gray-800 mb-6">최근 글</h2>
          <div className="flex-1 overflow-y-auto flex flex-col gap-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="bg-white border rounded-xl p-6 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#71D980] bg-[#f0fdf2] px-2 py-1 rounded-full">
                    {post.tag}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{post.title}</h3>

                {post.tag === "러닝기록" ? (
                  <p className="text-gray-500 text-sm">
                    {post.distance}km • {post.time} • {post.pace}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">{post.description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="shrink-0 text-center text-gray-400 text-sm py-4 border-t">
        {/* shrink-0 : 푸터 높이 고정 */}
        © 2026 김경런 · kimkyeong.run
      </footer>

    </main>
  )
}