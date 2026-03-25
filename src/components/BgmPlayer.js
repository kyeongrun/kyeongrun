"use client";

import { useState, useEffect, useRef } from "react";

// ← React 컴포넌트 밖에 audio 객체 선언 (페이지 이동해도 절대 리셋 안 됨)
let globalAudio = null;

export default function BgmPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    // globalAudio가 없을 때만 딱 한 번 생성
    if (!globalAudio) {
      globalAudio = new Audio("/music/bgm.mp3");
      globalAudio.loop = true;
      globalAudio.volume = 0.5;
    }

    // 현재 재생 상태 동기화
    setIsPlaying(!globalAudio.paused);
    setVolume(globalAudio.volume);
  }, []); // ← [] 덕분에 처음 한 번만 실행돼요

  function togglePlay() {
    if (!globalAudio) return;

    if (isPlaying) {
      globalAudio.pause();
    } else {
      globalAudio.play();
    }
    setIsPlaying(!isPlaying);
  }

  function handleVolume(e) {
    const val = Number(e.target.value);
    const normalized = val / 100;
    setVolume(normalized);
    if (globalAudio) globalAudio.volume = normalized;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-2">

      {showVolume && (
        <div className="bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
          <span className="text-sm">🔈</span>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(volume * 100)}
            onChange={handleVolume}
            className="w-24 accent-orange-500"
          />
          <span className="text-sm">🔊</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-800">🎵 BGM</p>
          <p className="text-xs text-gray-400">kimkyeong.run</p>
        </div>

        <button
          onClick={togglePlay}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg transition"
        >
          {isPlaying ? "⏸" : "▶️"}
        </button>

        <button
          onClick={() => setShowVolume(!showVolume)}
          className="text-gray-500 hover:text-orange-500 transition text-lg"
        >
          🔊
        </button>
      </div>
    </div>
  );
}