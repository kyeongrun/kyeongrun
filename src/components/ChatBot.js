"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "마!! 반갑다!! 내는 경런봇이다 🏃\n 앞으로 햄이라 부르고 러닝이나 블로그에 대해 뭐든 물어봐라!!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 드래그 크기 조절용 state
  const [size, setSize] = useState({ width: 320, height: 450 });
  const isResizing = useRef(false);  // 드래그 중인지 여부
  const startPos = useRef({});       // 드래그 시작 위치
  const startSize = useRef({});      // 드래그 시작 시점의 크기

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 드래그 시작 (모서리 mousedown)
  const handleResizeStart = (e) => {
    e.preventDefault()
    isResizing.current = true
    startPos.current = { x: e.clientX, y: e.clientY }
    startSize.current = { width: size.width, height: size.height }

    // 마우스 이동/떼기 이벤트 등록
    window.addEventListener("mousemove", handleResizeMove)
    window.addEventListener("mouseup", handleResizeEnd)
  }

  // 드래그 중 (크기 계산)
  const handleResizeMove = (e) => {
    if (!isResizing.current) return

    // 마우스가 얼마나 움직였는지 계산
    const dx = startPos.current.x - e.clientX  // 왼쪽으로 드래그 = 가로 증가
    const dy = startPos.current.y - e.clientY  // 위로 드래그 = 세로 증가

    setSize({
      width: Math.max(280, startSize.current.width + dx),   // 최소 280px
      height: Math.max(350, startSize.current.height + dy), // 최소 350px
    })
  }

  // 드래그 끝
  const handleResizeEnd = () => {
    isResizing.current = false
    window.removeEventListener("mousemove", handleResizeMove)
    window.removeEventListener("mouseup", handleResizeEnd)
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "마! 니 때매 오류떴다아이가 😅 좀있다 다시 질문해라 콱!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-24 right-5 bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-100 overflow-hidden"
          style={{ width: `${size.width}px`, height: `${size.height}px` }}
          // ↑ Tailwind 대신 style로 동적 크기 적용
        >
          {/* 헤더 */}
          <div className="bg-orange-500 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏃</span>
              <div>
                <p className="text-white font-bold text-sm">경런봇</p>
                <p className="text-orange-100 text-xs">러닝 AI 도우미</p>
              </div>
            </div>
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
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <span className="text-lg mr-1 mt-1 flex-shrink-0">🏃</span>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-orange-500 text-white rounded-br-sm"
                      : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

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
            <div ref={messagesEndRef} />
          </div>

          {/* 입력창 */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요..."
              disabled={isLoading}
              className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-orange-400 transition-colors disabled:bg-gray-50"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>

          {/* 드래그 핸들 (왼쪽 상단 모서리) */}
          <div
            onMouseDown={handleResizeStart}
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize"
            // cursor-nw-resize : 북서 방향 화살표 커서
            title="드래그해서 크기 조절"
          >
            {/* 모서리 표시 아이콘 */}
            <svg width="12" height="12" viewBox="0 0 12 12" className="text-white opacity-60 m-0.5">
              <path d="M0 12 L12 0" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M0 7 L7 0" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M0 2 L2 0" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>

        </div>
      )}

      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110 z-50"
        aria-label="경런봇 열기"
      >
        {isOpen ? "✕" : "🏃"}
      </button>
    </>
  );
}