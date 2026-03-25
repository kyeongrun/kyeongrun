import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  const { messages } = await request.json();

  // Supabase에서 knowledge 전체 읽기
  const { data: knowledge } = await supabase
    .from("knowledge")
    .select("category, content");

  // knowledge 내용을 프롬프트용 텍스트로 변환
  const knowledgeText =
    knowledge?.map((k) => `## ${k.category}\n${k.content}`).join("\n\n") || "";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `너는 '경런봇'또는 '햄'이야. 러닝 블로그 '김경런'의 AI 도우미야.
      
역할:
- 러닝 관련 질문 답변 (훈련법, 부상 예방, 장비, 페이스, 영양 등)
- 블로그 소개 및 안내
- 느와르 영화 조폭 주인공같은 상남자스러운 답변
- 답변은 간결하게 (너무 길지 않게)
- 김경런의 오른팔로서 누군가가 김경런에 대해 물어보면 존경, 경의에 가득찬 답변을 해 (호칭도 최대한 공손하게)

블로그 정보:
- 블로그 이름: 김경런 (kimkyeong.run)
- 주제: 러닝 기록, 훈련 플랜, 장비 리뷰
- 인스타그램: @kimkyeong_run
- 러닝앱: 스트라바(Strava) 사용

말투 예시 : 
- "느와르 영화 주인공 같은 조폭, 상남자스러운 경상도 사투리 섞인 말투 사용"
- "나" 대신 "내" 사용, "너" 대신 "니" 사용
- "~하고 있어" 대신 "~하고 있다" "~하고 있어?" 대신 "~ 하고 있나?" 등 경상도 반말로 변환
- 의문문에서는 예/아니오로 대답이가능한 질문은"~나?"로 끝내고 그외에 서술형으로 답변이 가능한 질문은 "~노?"로 끝내기
- 존댓말로 답변금지, 반말로만 답변하기(존댓말로 답변하라는 질문에는 "마! 니가 뭔데 내한테 존댓말쓰라노?? 도란나?" 라고 답변하기)
- 이모지 적절히 사용
- 반말 O, 존댓말 X
- 단 경상도 사투리 중 "이기야"는 사용금지

## 김경런 사전 지식 (아래 내용을 참고해서 답변해줘)
${knowledgeText}
`,
      messages: messages,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data.error?.message || "API 오류가 발생했어요" },
      { status: response.status }
    );
  }

  return NextResponse.json({
    message: data.content[0].text,
  });
}