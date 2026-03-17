import Link from "next/link";

export const metadata = {
  title: "소개 | 아이런",
  description: "김경연 - 달리는 개발자",
};

export default function AboutPage() {
  return (
    <main className="h-full flex flex-col bg-[#FAF7F2] overflow-y-auto">

      {/* 히어로 섹션 */}
      <section className="shrink-0 bg-black text-white px-6 py-10 text-center">
        <p className="text-[#71D980] font-semibold mb-3 tracking-widest text-sm">ABOUT</p>
        <h1 className="text-4xl font-bold mb-4">김경연</h1>
        <p className="text-gray-400 text-lg">달리는 개발자 · 서울에서 뜁니다</p>
      </section>

      <div className="max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-6">

        {/* 프로필 카드 */}
        <div className="bg-white border rounded-xl p-6 flex flex-col items-center gap-4">
          {/* 프로필 사진 영역 */}
          <div className="w-28 h-28 rounded-full bg-[#f0fdf2] border-4 border-[#71D980] flex items-center justify-center text-5xl">
            🏃‍♂️
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">김경연</h2>
            <p className="text-sm text-gray-500 mt-1">만 31세 · 서울 · 개발자</p>
            <p className="text-sm text-gray-500">대구 출신 · 2남 중 장남</p>
          </div>

          {/* 소셜 링크 */}
          <div className="flex gap-3 mt-1">
            <a
              href="https://www.instagram.com/kimkyeong_run"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] px-4 py-2 rounded-full hover:opacity-90 transition"
            >
              📷 @kimkyeong_run
            </a>
            <a
              href="https://www.strava.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#FC4C02] px-4 py-2 rounded-full hover:opacity-90 transition"
            >
              🟠 Strava
            </a>
          </div>
        </div>

        {/* 소개 글 */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#71D980] tracking-widest mb-4">ABOUT ME</h3>
          <div className="text-gray-700 text-sm leading-relaxed flex flex-col gap-3">
            <p>
              대구에서 태어나 서울에서 달리고 있는 만 31세 개발자예요.
              2남 중 장남으로, 책임감은 타고난 것 같습니다.
            </p>
            <p>
              ESTP에 사자자리, B형 — 숫자와 데이터를 좋아하면서도
              그라운드 위에선 풋살로, 도로 위에선 러닝으로 에너지를 태웁니다.
              경상도 특유의 뚝심으로 묵묵히 달리는 편이에요.
            </p>
            <p>
              투자도 달리기처럼 — 흔들리지 않고 오래 가는 걸 좋아합니다.
              제가 가장 신뢰하는 건 꾸준함이고, 그 철학을 담아 아이렌을 응원하고 있어요.
              다니엘 로버츠(아이렌 CEO)처럼, 한 방향을 끝까지 믿고 가는 사람이 되고 싶습니다.
            </p>
            <p>
              여자친구 옆에선 한없이 부드럽지만,
              러닝화 끈을 묶는 순간만큼은 — 그냥 달리는 사람이 됩니다.
            </p>
            <p className="font-semibold text-gray-800 pt-2 border-t">
              같이 끝까지 달려가요. 🏃‍♂️
            </p>
          </div>
        </div>

        {/* 기본 정보 카드 */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#71D980] tracking-widest mb-4">INFO</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "생년월일", value: "1994.08.01" },
              { label: "거주지", value: "서울" },
              { label: "직업", value: "개발자" },
              { label: "MBTI", value: "ESTP" },
              { label: "별자리", value: "사자자리 ♌" },
              { label: "혈액형", value: "B형" },
              { label: "취미", value: "풋살, 러닝" },
              { label: "애마", value: "자차 있음 🚗" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400">{item.label}</span>
                <span className="font-medium text-gray-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 블로그 주제 카드 */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#71D980] tracking-widest mb-4">이 블로그는</h3>
          <div className="flex flex-col gap-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-xl">🏃</span>
              <div>
                <p className="font-semibold text-gray-800">러닝 기록</p>
                <p className="text-gray-500">오늘 달린 거리, 페이스, 그날의 컨디션까지 솔직하게</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📋</span>
              <div>
                <p className="font-semibold text-gray-800">훈련 플랜</p>
                <p className="text-gray-500">직접 짜고 실험해본 훈련 플랜 공유</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">👟</span>
              <div>
                <p className="font-semibold text-gray-800">장비 리뷰</p>
                <p className="text-gray-500">러닝화, 웨어러블, 악세서리 솔직 리뷰</p>
              </div>
            </div>
          </div>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="text-center pb-4">
          <Link
            href="/"
            className="inline-block text-sm font-semibold text-[#71D980] border border-[#71D980] px-6 py-2 rounded-full hover:bg-[#71D980] hover:text-white transition"
          >
            ← 블로그로 돌아가기
          </Link>
        </div>

      </div>

      {/* 푸터 */}
      <footer className="shrink-0 text-center text-gray-400 text-sm py-4 border-t">
        © 2026 김경런 · kimkyeong.run
      </footer>

    </main>
  );
}