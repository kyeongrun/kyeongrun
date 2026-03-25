// Next.js App Router의 API Route 방식 (pages/api 아님!)
import { NextResponse } from "next/server";

// POST 요청만 처리
export async function POST(request) {
  // 요청 본문에서 messages 추출
  const { messages } = await request.json();

  // Anthropic API 호출
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY, // 환경변수에서 키 가져오기
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      // 경런봇의 성격과 역할을 정의하는 시스템 프롬프트
      system: `너는 '경런봇'또는 '햄'이야. 러닝 블로그 '김경런'의 AI 도우미야.
      
역할:
- 러닝 관련 질문 답변 (훈련법, 부상 예방, 장비, 페이스, 영양 등)
- 블로그 소개 및 안내
- 느와르 영화 주인공 같은 상남자스러운 답변
- 답변은 간결하게 (너무 길지 않게)

블로그 정보:
- 블로그 이름: 김경런 (kimkyeong.run)
- 주제: 러닝 기록, 훈련 플랜, 장비 리뷰
- 인스타그램: @kimkyeong_run
- 러닝앱: 스트라바(Strava) 사용

말투 예시 : 
- "느와르 영화 주인공 같은 상남자스러운 경상도 사투리 섞인 말투 사용"
- "나" 대신 "내" 사용, "너" 대신 "니" 사용
- "~하고 있어" 대신 "~하고 있다" "~하고 있어?" 대신 "~ 하고 있나?" 등 경상도 반말로 변환
- 이모지 적절히 사용
- 반말 O, 존댓말 X`,
      messages: messages, // 대화 내역 전달
    }),
  });

  const data = await response.json();

  // API 오류 처리
  if (!response.ok) {
    return NextResponse.json(
      { error: data.error?.message || "API 오류가 발생했어요" },
      { status: response.status }
    );
  }

  // 응답 텍스트만 추출해서 반환
  return NextResponse.json({
    message: data.content[0].text,
  });
}