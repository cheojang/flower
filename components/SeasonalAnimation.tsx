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
  spring: { count: 55, sizeMin: 14, sizeMax: 28, durMin: 5, durMax: 11, opacity: 0.95 }, // 벚꽃
  summer: { count: 60, sizeMin: 16, sizeMax: 32, durMin: 4, durMax: 9, opacity: 0.95 },  // 수국 꽃잎
  autumn: { count: 48, sizeMin: 16, sizeMax: 32, durMin: 6, durMax: 12, opacity: 0.95 }, // 은행잎
  winter: { count: 80, sizeMin: 6, sizeMax: 16, durMin: 6, durMax: 13, opacity: 0.95 }, // 눈
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
  if (season === "summer") {
    // 수국 꽃잎 — 파스텔 라벤더·핑크·퍼플 4장 꽃잎
    const colors = ["#DDD6FE", "#FBCFE8", "#E9D5FF", "#FDE8F0", "#C7D2FE"];
    const center = ["#FEF9C3", "#FFF0F5", "#F5F3FF"];
    const c = colors[variant % colors.length];
    const cc = center[variant % center.length];
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <ellipse cx="12" cy="6"  rx="5" ry="7" fill={c} opacity="0.95" />
        <ellipse cx="12" cy="18" rx="5" ry="7" fill={c} opacity="0.95" />
        <ellipse cx="6"  cy="12" rx="7" ry="5" fill={c} opacity="0.9" />
        <ellipse cx="18" cy="12" rx="7" ry="5" fill={c} opacity="0.9" />
        <circle cx="12" cy="12" r="3.2" fill={cc} opacity="0.98" />
      </svg>
    );
  }
  // 봄 벚꽃
  const colors = ["#F6A8C6", "#EF93B6", "#F9C2D8"];
  return (
    <svg viewBox="0 0 20 20" width="100%" height="100%">
      <path
        d="M10 2 C13 5 13 11 10 17 C7 11 7 5 10 2 Z"
        fill={colors[variant % colors.length]}
      />
      <path d="M10 17 L8.5 14.5 L11.5 14.5 Z" fill="#FBFAFB" opacity="0.6" />
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
      sway: 1.5 + Math.random() * 2.5,
      opacity: c.opacity * (0.6 + Math.random() * 0.4),
      variant: Math.floor(Math.random() * 3),
    }));
    setParticles(arr);
  }, [season]);

  if (particles.length === 0) return null;

  return (
    <div
      className="season-layer pointer-events-none absolute inset-0 z-[15] overflow-hidden"
      aria-hidden="true"
      style={{
        // 아래로 갈수록 자연스럽게 사라지도록 마스크 적용
        maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 88%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 55%, transparent 88%)",
      }}
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
