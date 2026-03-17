import { cookies } from 'next/headers'
// cookies : 브라우저 쿠키를 읽고 쓰는 Next.js 함수

export async function POST(request) {
  const { password } = await request.json()
  // 요청에서 비밀번호 꺼내기

  const correct = process.env.ADMIN_PASSWORD
  // 환경변수에서 정답 비밀번호 가져오기

  if (password !== correct) {
    return new Response('Unauthorized', { status: 401 })
    // 비밀번호 틀리면 401 에러 반환
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_auth', 'true', {
    httpOnly: true,   // JavaScript에서 접근 불가 (보안)
    maxAge: 60 * 60 * 24, // 24시간 유지
    path: '/',
  })
  // 쿠키에 로그인 상태 저장

  return new Response('OK', { status: 200 })
}