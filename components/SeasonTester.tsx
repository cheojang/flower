"use client";

// ⚠️ 테스트용 컴포넌트 — 계절 미리보기 토글.
// 삭제하려면: 이 파일 + app/page.tsx 의 <SeasonTester /> 한 줄만 지우면 됩니다.

import { useRouter } from "next/navigation";
import { seasonLabel, type Season } from "@/lib/config";

const ORDER: Season[] = ["spring", "summer", "autumn", "winter"];

export default function SeasonTester({ current }: { current: Season }) {
  const router = useRouter();

  const go = (s: Season) => {
    router.push(`/?season=${s}`, { scroll: false });
  };

  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];

  return (
    <div className="fixed right-3 top-20 z-50 flex flex-col items-end gap-2">
      <button
        onClick={() => go(next)}
        className="rounded-full border border-ink/15 bg-white/90 px-4 py-2 text-sm font-medium text-ink shadow-soft backdrop-blur transition hover:bg-white"
        aria-label="계절 바꾸기"
      >
        {seasonLabel[current]} <span className="text-ink-soft">→ 다음 계절</span>
      </button>
      <div className="flex gap-1 rounded-full border border-ink/10 bg-white/80 p-1 shadow-soft backdrop-blur">
        {ORDER.map((s) => (
          <button
            key={s}
            onClick={() => go(s)}
            className={`rounded-full px-2.5 py-1 text-xs transition ${
              s === current ? "bg-ink text-white" : "text-ink-soft hover:bg-ink/5"
            }`}
          >
            {seasonLabel[s]}
          </button>
        ))}
      </div>
      <span className="rounded bg-ink/70 px-2 py-0.5 text-[10px] text-white">테스트용 · 추후 삭제</span>
    </div>
  );
}
