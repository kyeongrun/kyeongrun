import "./globals.css";

export const metadata = {
  title: "김경런",
  description: "러닝 기록, 훈련 플랜, 장비 리뷰까지",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>

        {/* 상단 공지 배너 */}
        <a
          href="https://www.instagram.com/kimkyeong_run"
          // 클릭하면 인스타그램 계정으로 이동해요
          target="_blank"
          // target="_blank" = 새 탭으로 열어요
          rel="noopener noreferrer"
          // 보안을 위해 추가해요
          // noopener = 새 탭에서 원본 페이지 접근을 막아요
          // noreferrer = 이전 페이지 정보를 숨겨요
          className="block bg-orange-500 text-white text-center text-sm py-2 hover:bg-orange-600 transition"
          // block = 전체 너비로 표시해요
          // hover:bg-orange-600 = 마우스 올리면 색이 진해져요
        >
          🏃 러닝크루 모집 중 · 인스타그램 @kimkyeong_run 으로 DM 주세요!
        </a>

        {children}
        {/* children = 각 페이지의 내용이 여기에 들어와요 */}

      </body>
    </html>
  );
}