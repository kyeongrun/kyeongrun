import { incrementViews } from '../../../../../../lib/posts'

export async function POST(request, { params }) {
  const { slug } = await params
  await incrementViews(slug)
  return new Response('OK', { status: 200 })
}