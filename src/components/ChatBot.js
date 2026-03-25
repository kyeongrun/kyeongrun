"use client"; // 클라이언트 컴포넌트 선언 (useState, useEffect 사용하려면 필수)

import { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  // 채팅창 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);

  // 대화 내역 저장 (배열)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      // 첫 인사말
      content: "마!! 반갑다!! 내는 경런봇이다 🏃\n 앞으로 햄이라 부르고 러닝이나 블로그에 대해 뭐든 물어봐라!!",
    },
  ]);

  // 입력창 텍스트 상태
  const [input, setInput] = useState("");

  // AI 응답 기다리는 중 상태
  const [isLoading, setIsLoading] = useState(false);

  // 채팅창 맨 아래로 자동 스크롤하기 위한 ref
  const messagesEndRef = useRef(null);

  // 메시지가 추가될 때마다 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 전송 함수
  const sendMessage = async () => {
    // 빈 입력이거나 로딩 중이면 무시
    if (!input.trim() || isLoading) return;

    // 사용자 메시지를 대화 내역에 추가
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput(""); // 입력창 초기화
    setIsLoading(true); // 로딩 시작

    try {
      // API Route 호출 (내 서버 → Anthropic API)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 시스템 메시지 제외하고 user/assistant 메시지만 전달
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // AI 응답을 대화 내역에 추가
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      // 오류 발생 시 오류 메시지 표시
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "마! 니 때매 오류떴다아이가 😅 좀있다 다시 질문해라 콱!",
        },
      ]);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 엔터키로 전송 (Shift+Enter는 줄바꿈)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 기본 줄바꿈 방지
      sendMessage();
    }
  };

  return (
    <>
      {/* 채팅창 본체 - isOpen일 때만 보임 */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 w-80 h-[450px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-100 overflow-hidden">
          
          {/* 헤더 */}
          <div className="bg-orange-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏃</span>
              <div>
                <p className="text-white font-bold text-sm">경런봇</p>
                <p className="text-orange-100 text-xs">러닝 AI 도우미</p>
              </div>
            </div>
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-orange-200 transition-colors text-lg leading-none"
            >
              ✕
            </button>
          </div>

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                // AI는 왼쪽, 사용자는 오른쪽 정렬
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* AI 아이콘 */}
                {msg.role === "assistant" && (
                  <span className="text-lg mr-1 mt-1 flex-shrink-0">🏃</span>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-orange-500 text-white rounded-br-sm" // 사용자: 주황색
                      : "bg-white text-gray-800 shadow-sm rounded-bl-sm" // AI: 흰색
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* 로딩 중 표시 (점점점 애니메이션) */}
            {isLoading && (
              <div className="flex justify-start">
                <span className="text-lg mr-1">🏃</span>
                <div className="bg-white px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                  </div>
                </div>
              </div>
            )}

            {/* 자동 스크롤 타겟 */}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력창 */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요..."
              disabled={isLoading} // 로딩 중엔 입력 비활성화
              className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-orange-400 transition-colors disabled:bg-gray-50"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()} // 비어있거나 로딩 중엔 비활성화
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            >
              {/* 전송 아이콘 */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 플로팅 버튼 (항상 보임) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110 z-50"
        aria-label="경런봇 열기"
      >
        {/* 열려있으면 X, 닫혀있으면 러닝 이모지 */}
        {isOpen ? "✕" : "🏃"}
      </button>
    </>
  );
}