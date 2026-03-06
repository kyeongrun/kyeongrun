export default function Home() {
  const posts = [
    {
      id: 1,
      title: "#1 망원한강공원 러닝",
      date: "2026-03-01",
      /*description: "오늘의 러닝 코스와 페이스를 기록했어요.",*/
      distance: "6.04km",
      time: "00:35:09",
      pace: "5:49/km",
      tag: "러닝기록"
    },
    {
      id: 2,
      title: "마라톤 훈련 플랜",
      date: "2026-03-02",
      description: "풀마라톤을 준비하는 12주 훈련 플랜을 소개해요.",
      tag: "훈련플랜"
    },
    {
      id: 3,
      title: "러닝화 추천",
      date: "2026-03-03",
      description: "초보 러너를 위한 러닝화 추천 가이드예요.",
      tag: "장비"
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50">

      {/* 헤더 */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏃</span>
          <span className="font-bold text-xl text-gray-800">김경런</span>
        </div>
        <nav className="flex gap-6 text-sm text-gray-500">
          <a href="/" className="hover:text-black transition">홈</a>
          <a href="/about" className="hover:text-black transition">소개</a>
        </nav>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-black text-white px-6 py-20 text-center">
        <p className="text-orange-400 font-semibold mb-3 tracking-widest text-sm">RUNNING BLOG</p>
        <h1 className="text-4xl font-bold mb-4">달리는 김경런</h1>
        <p className="text-gray-400 text-lg">러닝 기록, 훈련 플랜, 장비 리뷰까지</p>
      </section>

      {/* 글 목록 */}
      <section className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">최근 글</h2>
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border rounded-xl p-6 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                  {post.tag}
                </span>
                <span className="text-xs text-gray-400">{post.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{post.title}</h3>
              <p className="text-gray-500 text-sm">{post.description}</p>
              <p className="text-gray-500 text-sm">{post.distance} • {post.time} • {post.pace}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="text-center text-gray-400 text-sm py-8">
        © 2026 김경런 · kimkyeong.run
      </footer>

      <script>
 window.aionChatbotConfig = { 
  token: 'ifA1UJTsfV6XKKhX', 
  isDev: true,
  baseUrl: 'https://studio.abclab.ktds.com',
  isOpen: false,               // 채팅열림설정
  isStartButtonShow: false,     // 채팅시작버튼 보임설정
  bgcolor: '#3D53FF',          // 버튼 배경색상
  //openIcon: 'https://aion/aaa.jpg',  // 채팅을 열때 사용하는 아이콘
  //closeIcon: 'https://aion/bbb.jpg', // 채팅을 닫을때 사용하는 아이콘
  iconSize: '100%',            // 아이콘의 사이즈 (버튼의 사이즈 대비)
  totalIconSize: '3rem',       // 버튼의 사이즈
  totalBorderRadius: '1.5rem', // 버튼의 둥글기 정도
  bottom: '1rem',              // 버튼의 하단기준 위치
  right: '1rem',               // 버튼의 우측기준 위치
  chatBottom : '5rem',         // 채팅의 하단기준 위치
  chatRight : '1rem',          // 채팅의 우측기준 위치
  zoom : 1.0,                  // 채팅창 크기확대
  input: {                     // 채팅 시작전 변수값 설정
                               // name: '박보검',
                               // age: '25'
  }
 }
</script>
<script
 src="https://studio.abclab.ktds.com/embed.min.js"
 id="ifA1UJTsfV6XKKhX"
 defer>
</script>
    </main>
    
  ) 
}

