import { incrementLikes } from '../../../../../../lib/posts'

export async function POST(request, { params }) {
  const { slug } = await params
  await incrementLikes(slug)
  return new Response('OK', { status: 200 })
}