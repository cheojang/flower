"use client";

import { useEffect, useRef, useState } from "react";

/** 스크롤 시 부드럽게 나타나는 래퍼 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // IntersectionObserver 미지원 환경: 즉시 노출
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);

    // 안전장치: 스크롤하지 않아도 일정 시간 후에는 반드시 노출 (콘텐츠가 영구히 숨겨지지 않도록)
    const fallback = setTimeout(() => setShown(true), 1500);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${shown ? "in-view" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
