import { getAllPosts } from "../../lib/posts";
import StockTicker from "../components/StockTicker";
import HomeContent from "../components/HomeContent";

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

      <HomeContent posts={posts} />

      {/* 푸터 */}
      <footer className="text-center text-gray-400 text-sm py-4 border-t">
        © 2026 김경런 · kimkyeong.run
      </footer>

    </main>
  )
}
