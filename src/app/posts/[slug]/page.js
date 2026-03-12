import { getPostBySlug, getAllPosts } from "../../../../lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Comments from "../../../components/Comments";

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
    <main className="min-h-screen bg-[#FAF7F2]">

      {/* 글 내용 */}
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8 items-start">
        {/* max-w-6xl : 전체 너비를 넓게 설정 (기존 max-w-2xl 보다 넓음) */}
        {/* flex-col : 모바일에서는 세로로 쌓기 */}
        {/* lg:flex-row : PC(1024px 이상)에서는 가로로 나란히 */}
        {/* gap-8 : 글과 댓글 사이 간격 */}
        {/* items-start : 양쪽 컬럼이 위쪽 기준으로 정렬 */}

        {/* 왼쪽: 글 본문 */}
        <article className="w-full lg:w-1/2">
          {/* w-full : 모바일에서는 전체 너비 */}
          {/* lg:w-2/3 : PC에서는 전체의 2/3 너비 */}

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
          </div>

          {/* 목록으로 돌아가기 */}
          <div className="mt-12">
            <Link href="/" className="text-orange-500 hover:underline text-sm">
              ← 목록으로 돌아가기
            </Link>
          </div>

        </article>

        {/* 오른쪽: 댓글 */}
        <aside className="w-full lg:w-1/2 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          {/* lg:top-0 : 화면 맨 위에 고정 */}
          {/* lg:h-screen : 화면 전체 높이 */}
          {/* lg:overflow-y-auto : 댓글이 많아지면 댓글창 안에서만 스크롤 */}
          <div className="p-6">
            {/* 테두리(border), 배경(bg-white), 둥근모서리(rounded-xl) 전부 제거 */}
            <Comments
              pageId={slug}
              pageTitle={post.title}
              pageUrl={`https://kimkyeong.run/posts/${slug}`}
            />
          </div>
        </aside>

      </div>

      {/* 푸터 */}
      <footer className="text-center text-gray-400 text-sm py-8">
        © 2026 김경런 · kimkyeong.run
      </footer>

    </main>
  )
}