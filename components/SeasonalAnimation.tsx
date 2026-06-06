"use client";

import { useEffect, useState } from "react";
import type { Season } from "@/lib/config";

type Particle = {
  left: number;
  size: number;
  dur: number;
  delay: number;
  sway: number;
  opacity: number;
  variant: number;
};

const CONFIG: Record<
  Season,
  { count: number; sizeMin: number; sizeMax: number; durMin: number; durMax: number; opacity: number }
> = {
  spring: { count: 26, sizeMin: 12, sizeMax: 22, durMin: 7, durMax: 13, opacity: 0.85 }, // 벚꽃
  summer: { count: 20, sizeMin: 10, sizeMax: 18, durMin: 9, durMax: 16, opacity: 0.7 }, // 꽃잎
  autumn: { count: 24, sizeMin: 14, sizeMax: 26, durMin: 8, durMax: 14, opacity: 0.85 }, // 은행잎
  winter: { count: 40, sizeMin: 6, sizeMax: 14, durMin: 8, durMax: 16, opacity: 0.9 }, // 눈
};

// 계절별 입자 모양 (SVG)
function Shape({ season, variant }: { season: Season; variant: number }) {
  if (season === "winter") {
    return (
      <svg viewBox="0 0 20 20" width="100%" height="100%">
        <circle cx="10" cy="10" r="6" fill="#FFFFFF" />
        <circle cx="10" cy="10" r="9" fill="#FFFFFF" opacity="0.3" />
      </svg>
    );
  }
  if (season === "autumn") {
    // 은행잎 (부채꼴)
    const colors = ["#F2D98C", "#E8C45C", "#EAB94B"];
    return (
      <svg viewBox="0 0 20 22" width="100%" height="100%">
        <path
          d="M10 21 Q6 13 4 7 Q10 10 16 7 Q14 13 10 21 Z"
          fill={colors[variant % colors.length]}
        />
        <line x1="10" y1="21" x2="10" y2="13" stroke="#D9A93B" strokeWidth="1" />
      </svg>
    );
  }
  // 봄 벚꽃 / 여름 꽃잎
  const colors =
    season === "spring"
      ? ["#F6A8C6", "#EF93B6", "#F9C2D8"] // 벚꽃 핑크 (선명하게)
      : ["#C9B8E6", "#B9D2E0", "#DAC6E6"]; // 여름 시원한 라벤더·하늘
  return (
    <svg viewBox="0 0 20 20" width="100%" height="100%">
      <path
        d="M10 2 C13 5 13 11 10 17 C7 11 7 5 10 2 Z"
        fill={colors[variant % colors.length]}
      />
      {/* 벚꽃 꽃잎 끝 살짝 갈라짐 */}
      {season === "spring" && (
        <path d="M10 17 L8.5 14.5 L11.5 14.5 Z" fill="#FBFAFB" opacity="0.6" />
      )}
    </svg>
  );
}

export default function SeasonalAnimation({ season }: { season: Season }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const c = CONFIG[season];
    const arr: Particle[] = Array.from({ length: c.count }, () => ({
      left: Math.random() * 100,
      size: c.sizeMin + Math.random() * (c.sizeMax - c.sizeMin),
      dur: c.durMin + Math.random() * (c.durMax - c.durMin),
      delay: -Math.random() * c.durMax, // 음수 딜레이로 처음부터 흩날리는 상태
      sway: 2 + Math.random() * 3,
      opacity: c.opacity * (0.6 + Math.random() * 0.4),
      variant: Math.floor(Math.random() * 3),
    }));
    setParticles(arr);
  }, [season]);

  if (particles.length === 0) return null;

  return (
    <div
      className="season-layer pointer-events-none fixed inset-0 z-[15] overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animation: `fall-y ${p.dur}s linear ${p.delay}s infinite`,
          }}
        >
          <span
            className="block h-full w-full"
            style={{
              opacity: p.opacity,
              filter: "drop-shadow(0 1px 1.5px rgba(92,74,69,0.12))",
              animation: `sway-x ${p.sway}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          >
            <Shape season={season} variant={p.variant} />
          </span>
        </span>
      ))}
    </div>
  );
}
