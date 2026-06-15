"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Season } from "@/lib/config";

const CONFIG: Record<
  Season,
  {
    count: number;
    sizeMin: number;
    sizeMax: number;
    durMin: number;
    durMax: number;
    opacity: number;
  }
> = {
  spring: { count: 50, sizeMin: 14, sizeMax: 28, durMin: 6, durMax: 12, opacity: 0.95 },
  summer: { count: 55, sizeMin: 16, sizeMax: 32, durMin: 5, durMax: 10, opacity: 0.95 },
  autumn: { count: 44, sizeMin: 16, sizeMax: 32, durMin: 6, durMax: 12, opacity: 0.95 },
  winter: { count: 75, sizeMin: 6, sizeMax: 16, durMin: 6, durMax: 13, opacity: 0.95 },
};

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
    // 변이 0 → 단풍잎(주황·빨강), 1·2 → 은행잎(노랑) — 노란빛이 더 많게
    if (variant % 3 !== 0) {
      const golds = ["#F4D03F", "#F2C53D", "#EFD35A"];
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          {/* 은행나무 잎 — 부채꼴 + 가운데 살짝 갈라진 홈 */}
          <path
            d="M12 21 C8 16 5 11 6 9 C8 10 10 10.4 11.4 10.8 L12 9.2 L12.6 10.8 C14 10.4 16 10 18 9 C19 11 16 16 12 21 Z"
            fill={golds[variant % golds.length]}
          />
          <line x1="12" y1="21" x2="12" y2="14.5" stroke="#E0B72E" strokeWidth="1" />
        </svg>
      );
    }
    const reds = ["#E8743B", "#D9542E", "#E89A37"];
    return (
      <svg viewBox="0 0 20 22" width="100%" height="100%">
        {/* 단풍잎 */}
        <path d="M10 21 Q6 13 4 7 Q10 10 16 7 Q14 13 10 21 Z" fill={reds[variant % reds.length]} />
        <line x1="10" y1="21" x2="10" y2="13" stroke="#B8472A" strokeWidth="1" />
      </svg>
    );
  }
  if (season === "summer") {
    const colors = ["#DDD6FE", "#FBCFE8", "#E9D5FF", "#FDE8F0", "#C7D2FE"];
    const center = ["#FEF9C3", "#FFF0F5", "#F5F3FF"];
    const c = colors[variant % colors.length];
    const cc = center[variant % center.length];
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <ellipse cx="12" cy="6" rx="5" ry="7" fill={c} opacity="0.95" />
        <ellipse cx="12" cy="18" rx="5" ry="7" fill={c} opacity="0.95" />
        <ellipse cx="6" cy="12" rx="7" ry="5" fill={c} opacity="0.9" />
        <ellipse cx="18" cy="12" rx="7" ry="5" fill={c} opacity="0.9" />
        <circle cx="12" cy="12" r="3.2" fill={cc} opacity="0.98" />
      </svg>
    );
  }
  // 봄 — 벚꽃잎 (한층 연한 파스텔 핑크)
  const colors = ["#FBD9E6", "#FCE3EE", "#F8CFE0"];
  return (
    <svg viewBox="0 0 20 20" width="100%" height="100%">
      <path d="M10 2 C13 5 13 11 10 17 C7 11 7 5 10 2 Z" fill={colors[variant % colors.length]} />
      <path d="M10 17 L8.5 14.5 L11.5 14.5 Z" fill="#FFFFFF" opacity="0.65" />
    </svg>
  );
}

const layerClass =
  "season-layer pointer-events-none absolute inset-0 z-[5] overflow-hidden";
const layerStyle = {
  maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 88%)",
  WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 88%)",
} as const;

type Phys = { x: number; y: number; vx: number; vy: number; rot: number; vr: number; g: number };

// ────────────────────────────────────────────────
// JS 물리 시뮬레이션 (마우스/터치 자석 효과)
// pointer-events-none 컨테이너라 버튼 탭에 영향 없음
// ────────────────────────────────────────────────
function InteractiveParticles({
  season,
  isMobile,
}: {
  season: Season;
  isMobile: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const meta = useMemo(() => {
    const c = CONFIG[season];
    // 모바일은 입자 수 약간 축소
    const count = isMobile ? Math.round(c.count * 0.65) : c.count;
    return Array.from({ length: count }, () => ({
      size: c.sizeMin + Math.random() * (c.sizeMax - c.sizeMin),
      opacity: c.opacity * (0.65 + Math.random() * 0.35),
      variant: Math.floor(Math.random() * 3),
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.6 + Math.random() * 0.9,
    }));
  }, [season, isMobile]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let w = container.clientWidth;
    let h = container.clientHeight || 1;

    const phys: Phys[] = meta.map((m) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: 0.4 + Math.random() * 0.8,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 2,
      g: 0.6 + m.size / 36,
    }));

    const mouse = { cx: 0, cy: 0, x: 0, y: 0, last: -9999 };

    const onPointerMove = (e: PointerEvent) => {
      mouse.cx = e.clientX;
      mouse.cy = e.clientY;
      mouse.last = performance.now();
    };
    // 터치 전용 보완 — pointermove가 잡지 못하는 경우 커버
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.cx = e.touches[0].clientX;
        mouse.cy = e.touches[0].clientY;
        mouse.last = performance.now();
      }
    };
    const onTouchEnd = () => { mouse.last = -9999; };
    const onResize = () => {
      w = container.clientWidth;
      h = container.clientHeight || 1;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("resize", onResize);

    // 모바일은 자석 반경·세기를 살짝 부드럽게
    const R = isMobile ? 320 : 280;
    const FORCE = isMobile ? 0.62 : 0.95;

    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const t = now / 1000;

      let active = false;
      if (now - mouse.last < 320) {
        const rect = container.getBoundingClientRect();
        mouse.x = mouse.cx - rect.left;
        mouse.y = mouse.cy - rect.top;
        active =
          mouse.x >= 0 && mouse.x <= rect.width && mouse.y >= 0 && mouse.y <= rect.height;
      }

      for (let i = 0; i < phys.length; i++) {
        const p = phys[i];
        const m = meta[i];
        p.vy += 0.03 * p.g;
        p.vx += Math.sin(t * m.swaySpeed + m.swayPhase) * 0.02;
        if (active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < R) {
            const f = (1 - d / R) * FORCE;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
            if (d < 70) {
              p.vx *= 0.82;
              p.vy *= 0.82;
            }
          }
        }
        p.vx *= 0.96;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr + p.vx * 1.5;
        if (p.y > h + 40) {
          p.y = -40;
          p.x = Math.random() * w;
          p.vx = (Math.random() - 0.5) * 0.4;
          p.vy = 0.4 + Math.random() * 0.6;
        }
        if (p.x < -50) p.x = w + 40;
        else if (p.x > w + 50) p.x = -40;
        const el = itemRefs.current[i];
        if (el) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rot}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
    };
  }, [meta, isMobile]);

  return (
    <div ref={containerRef} className={layerClass} aria-hidden="true" style={layerStyle}>
      {meta.map((m, i) => (
        <span
          key={`${season}-${i}`}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 will-change-transform"
          style={{
            width: m.size,
            height: m.size,
            opacity: m.opacity,
            filter: "drop-shadow(0 1px 1.5px rgba(92,74,69,0.12))",
          }}
        >
          <Shape season={season} variant={m.variant} />
        </span>
      ))}
    </div>
  );
}

export default function SeasonalAnimation({ season }: { season: Season }) {
  const [mode, setMode] = useState<"none" | "mobile" | "desktop">("none");

  useEffect(() => {
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    setMode(touch ? "mobile" : "desktop");
  }, []);

  if (mode === "none") return null;
  return <InteractiveParticles season={season} isMobile={mode === "mobile"} />;
}
