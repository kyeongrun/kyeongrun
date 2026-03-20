import { getPostBySlug } from "../../../../lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Comments from "../../../components/Comments";
import ViewCounter from '../../../components/ViewCounter'
import LikeButton from '../../../components/LikeButton'

// generateStaticParams 제거 → DB 기반은 동적 라우팅으로 처리해요
// Markdown 파일 기반일 때만 필요했던 함수예요

export default async function PostPage({ params }) {
  const { slug } = await params;

  const post = await getPostBySlug(slug); // await 추가 → DB 응답 기다리기

  // 글이 없을 때 처리
  if (!post) {
    return <p className="p-10 text-gray-500">글을 찾을 수 없어요.</p>
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2]">

      {/* 글 내용 */}
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8 items-start">
        {/* 왼쪽: 글 본문 */}
        <article className="w-full lg:w-1/2">

          {/* 글 메타데이터 */}
          <div className="mb-8">
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
              {post.tag}
            </span>
            <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">{post.title}</h1>
            {/* toLocaleDateString : 날짜를 읽기 좋은 형식으로 변환 */}
            <p className="text-gray-400 text-sm">
              {new Date(post.created_at).toLocaleDateString('ko-KR')}
            </p>

            {/* 러닝기록인 경우 distance, time, pace 표시 */}
            {post.tag === "러닝기록" && (
              <div className="flex gap-4 mt-4 bg-white border rounded-xl p-4">
                <span className="text-sm text-gray-600">🏃 {post.distance}km</span>
                <span className="text-sm text-gray-600">⏱️ {post.time}</span>
                <span className="text-sm text-gray-600">📈 {post.pace}</span>
              </div>
            )}

            {/* 조회수와 좋아요 */}
            <div className="flex gap-4 mt-4">
              <ViewCounter slug={slug} initialViews={post.views} />
              <LikeButton slug={slug} initialLikes={post.likes} />
            </div>

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
        <aside className="w-full lg:w-1/2 lg:sticky lg:top-0">
          <div className="p-6">
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