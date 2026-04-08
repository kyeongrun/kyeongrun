import { getAllPosts } from "../../lib/posts";
import Link from "next/link";
import StockTicker from "../components/StockTicker";
import StravaSection from "../components/StravaSection";
import NewsSection from "../components/NewsSection";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF7F2]">

      {/* 히어로 */}
      <section className="bg-black text-white px-6 py-10 text-center">
        <p className="text-[#71D980] font-semibold mb-3 tracking-widest text-sm">RUNNING BLOG</p>
        <h1 className="text-4xl font-bold mb-4">I RUN - 나는 달린다.</h1>
        <p className="text-gray-400 text-lg">러닝 기록, 훈련 플랜, 장비 리뷰까지</p>
        <StockTicker />
      </section>

      {/* 2 : 2 : 2 본문 (6컬럼) */}
      <div className="flex-1 w-full max-w-screen-xl mx-auto px-4 py-8 grid grid-cols-6 gap-5 items-start">

        {/* 왼쪽 2: 러닝 전체 */}
        <aside className="col-span-2">
          <StravaSection />
        </aside>

        {/* 가운데 2: 게시글 */}
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
              {post.tag === "러닝기록" ? (
                <p className="text-gray-500 text-sm">{post.distance}km • {post.time} • {post.pace}</p>
              ) : (
                <p className="text-gray-500 text-sm">{post.description}</p>
              )}
            </Link>
          ))}
        </section>

        {/* 오른쪽 2: IREN + BTC 뉴스 */}
        <aside className="col-span-2">
          <NewsSection />
        </aside>

      </div>

      {/* 푸터 */}
      <footer className="text-center text-gray-400 text-sm py-4 border-t">
        © 2026 김경런 · kimkyeong.run
      </footer>

    </main>
  )
}
