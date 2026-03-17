import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import BgmPlayer from "@/components/BgmPlayer";

export const metadata = {
  title: "아이런",
  description: "러닝 기록, 훈련 플랜, 장비 리뷰까지",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="h-full">
      {/* h-full : html 태그도 높이 100%로 설정 */}
      <body className="h-full flex flex-col overflow-hidden">
        {/* h-full : 전체 높이 사용 */}
        {/* flex flex-col : 세로로 쌓기 */}
        {/* overflow-hidden : 전체 스크롤 제거 */}

        {/* 상단 공지 배너 */}
        <a
          href="https://www.instagram.com/kimkyeong_run"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 block bg-[#71D980] text-white text-center text-sm py-2 hover:bg-[#5bc96a] transition"
        >
          {/* shrink-0 : 배너 높이 고정 (줄어들지 않게) */}
          🏃 러닝크루 모집 중 · 인스타그램 @kimkyeong_run 으로 DM 주세요!
        </a>

        {/* 헤더 네비게이션 */}
        <header className="shrink-0 flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-[#FAF7F2]">
          {/* shrink-0 : 헤더 높이 고정 */}

          <Link href="/">
            <Image
              src="/logo.png"
              alt="IRUN 로고"
              width={90}
              height={36}
            />
          </Link>

          <nav className="flex gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#5bc96a] transition">홈</Link>
            <Link href="/about" className="hover:text-[#5bc96a] transition">소개</Link>
          </nav>

        </header>

        {/* 페이지 내용 - 배너+헤더 제외한 나머지 공간 전부 차지 */}
        <div className="flex-1 overflow-hidden">
          {/* flex-1 : 남은 공간 전부 차지 */}
          {/* overflow-hidden : 이 영역 밖으로 넘치지 않게 */}
          {children}
        </div>

        <BgmPlayer />

      </body>
    </html>
  );
}