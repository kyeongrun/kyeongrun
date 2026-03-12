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
    <html lang="ko">
      <body>

        {/* 상단 공지 배너 - 인스타그램 링크 */}
        <a
          href="https://www.instagram.com/kimkyeong_run"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-[#71D980] text-white text-center text-sm py-2 hover:bg-[#5bc96a] transition"
        >
          🏃 러닝크루 모집 중 · 인스타그램 @kimkyeong_run 으로 DM 주세요!
        </a>

        {/* 헤더 네비게이션 */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-[#FAF7F2]">

          {/* 로고 - Link 사용으로 페이지 리로드 없이 이동 → 음악 유지 */}
          <Link href="/">
            <Image
              src="/logo.png"
              alt="IRUN 로고"
              width={90}
              height={36}
            />
          </Link>

          {/* 오른쪽 메뉴 - Link 사용으로 음악 유지 */}
          <nav className="flex gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#5bc96a] transition">홈</Link>
            <Link href="/about" className="hover:text-[#5bc96a] transition">소개</Link>
          </nav>

        </header>

        {children}
        <BgmPlayer />

      </body>
    </html>
  );
}