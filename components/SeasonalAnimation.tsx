"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Season } from "@/lib/config";

const CONFIG: Record<
  Season,
  { count: number; sizeMin: number; sizeMax: number; opacity: number }
> = {
  spring: { count: 50, sizeMin: 14, sizeMax: 28, opacity: 0.95 }, // 벚꽃
  summer: { count: 55, sizeMin: 16, sizeMax: 32, opacity: 0.95 }, // 수국 꽃잎
  autumn: { count: 44, sizeMin: 16, sizeMax: 32, opacity: 0.95 }, // 은행잎
  winter: { count: 75, sizeMin: 6, sizeMax: 16, opacity: 0.95 }, // 눈
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

type Phys = { x: number; y: number; vx: number; vy: number; rot: number; vr: number; g: number };

export default function SeasonalAnimation({ season }: { season: Season }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // 입자 메타데이터(크기/모양/흔들림 위상) — 계절 바뀔 때만 재생성
  const meta = useMemo(() => {
    const c = CONFIG[season];
    return Array.from({ length: c.count }, () => ({
      size: c.sizeMin + Math.random() * (c.sizeMax - c.sizeMin),
      opacity: c.opacity * (0.65 + Math.random() * 0.35),
      variant: Math.floor(Math.random() * 3),
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.6 + Math.random() * 0.9,
    }));
  }, [season]);

  useEffect(() => {
    // 모션 최소화 설정 시 동작 안 함
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let w = container.clientWidth;
    let h = container.clientHeight || 1;

    // 물리 상태 초기화 (화면 전체에 흩뿌림)
    const phys: Phys[] = meta.map((m) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: 0.4 + Math.random() * 0.8,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 2,
      // gravity 가중치(작을수록 가볍게 천천히)
      g: 0.6 + m.size / 36,
    }));

    const mouse = { x: 0, y: 0, inside: false, last: -9999 };

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.x = x;
      mouse.y = y;
      mouse.inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      mouse.last = performance.now();
    };
    const onResize = () => {
      w = container.clientWidth;
      h = container.clientHeight || 1;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);

    const R = 200; // 마우스 영향 반경(px)
    let raf = 0;

    const tick = () => {
      const now = performance.now();
      const t = now / 1000;
      // 마우스가 최근에 움직였고 영역 안에 있을 때만 끌어당김
      const active = mouse.inside && now - mouse.last < 260;

      for (let i = 0; i < phys.length; i++) {
        const p = phys[i];
        const m = meta[i];

        // 기본: 중력 + 좌우 흔들림
        p.vy += 0.03 * p.g;
        p.vx += Math.sin(t * m.swaySpeed + m.swayPhase) * 0.02;

        // 마우스 끌어당김 (가까울수록 강하게, 근처에선 감속해 모임=붙음)
        if (active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < R) {
            const f = (1 - d / R) * 1.25;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
            if (d < 70) {
              // 커서 근처: 강한 감속으로 자연스럽게 달라붙음
              p.vx *= 0.82;
              p.vy *= 0.82;
            }
          }
        }

        // 감쇠
        p.vx *= 0.96;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr + p.vx * 1.5;

        // 화면 벗어나면 위에서 다시 등장
        if (p.y > h + 40) {
          p.y = -40;
          p.x = Math.random() * w;
          p.vx = (Math.random() - 0.5) * 0.4;
          p.vy = 0.4 + Math.random() * 0.6;
        }
        if (p.x < -50) p.x = w + 40;
        else if (p.x > w + 50) p.x = -40;

        const el = itemRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rot}deg)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [meta]);

  return (
    <div
      ref={containerRef}
      className="season-layer pointer-events-none absolute inset-0 z-[15] overflow-hidden"
      aria-hidden="true"
      style={{
        maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 88%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 55%, transparent 88%)",
      }}
    >
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
