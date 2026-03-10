import { getPostBySlug, getAllPosts } from "../../../../lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }) {
  // async 를 추가했어요
  // params 를 비동기로 받아야 slug 가 제대로 넘어와요

  const { slug } = await params;
  // await 으로 params 를 받아야 해요
  // 바로 params.slug 쓰면 undefined 가 돼요

  const post = getPostBySlug(slug);
  // slug 로 해당 글의 데이터를 가져와요

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

      {/* 글 내용 */}
      <article className="max-w-2xl mx-auto px-4 py-12">

        {/* 글 메타데이터 */}
        <div className="mb-8">
          <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
            {post.tag}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">{post.title}</h1>
          <p className="text-gray-400 text-sm">{post.date}</p>

          {/* 러닝기록인 경우 distance, time, pace 표시 */}
          {post.tag === "러닝기록" && (
            <div className="flex gap-4 mt-4 bg-white border rounded-xl p-4">
              <span className="text-sm text-gray-600">🏃 {post.distance}</span>
              <span className="text-sm text-gray-600">⏱️ {post.time}</span>
              <span className="text-sm text-gray-600">📈 {post.pace}</span>
            </div>
          )}
        </div>

        {/* 구분선 */}
        <hr className="mb-8" />

        {/* Markdown 본문 */}
        <div className="prose prose-gray max-w-none">
          <MDXRemote source={post.content} />
          {/* post.content = Markdown 본문 내용이에요
              MDXRemote 가 Markdown 을 HTML 로 변환해서 보여줘요 */}
        </div>

        {/* 목록으로 돌아가기 */}
        <div className="mt-12">
          <a href="/" className="text-orange-500 hover:underline text-sm">
            ← 목록으로 돌아가기
          </a>
        </div>

      </article>

      {/* 푸터 */}
      <footer className="text-center text-gray-400 text-sm py-8">
        © 2026 김경런 · kimkyeong.run
      </footer>

    </main>
  )
}