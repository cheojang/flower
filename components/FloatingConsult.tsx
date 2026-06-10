"use client";

import { useState } from "react";
import { site } from "@/lib/config";

export default function FloatingConsult() {
  const [open, setOpen] = useState(false);

  const items = [
    {
      label: "카카오톡 상담",
      href: site.consult.kakaoChannel,
      bg: "bg-[#FEE500]",
      text: "text-[#3C1E1E]",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7-.2.7-.7 2.6-.8 3-.1.5.2.5.4.4.2-.1 2.7-1.8 3.8-2.6.6.1 1.3.1 1.9.1 5.5 0 10-3.6 10-8S17.5 3 12 3Z" />
        </svg>
      ),
    },
    {
      label: "네이버 톡톡",
      href: site.consult.naverTalk,
      bg: "bg-[#03C75A]",
      text: "text-white",
      icon: (
        <span className="text-sm font-extrabold leading-none">N</span>
      ),
    },
    {
      label: "전화 상담",
      href: `tel:${site.phone}`,
      bg: "bg-sage-deep",
      text: "text-white",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.1 2.2Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {/* 채널 목록 */}
      <div
        className={`flex flex-col items-end gap-2.5 transition-all duration-300 ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        {items.map((it) => (
          <a
            key={it.label}
            href={it.href}
            target={it.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="group flex items-center gap-2"
          >
            <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-ink shadow-soft">
              {it.label}
            </span>
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full shadow-soft transition group-active:scale-95 ${it.bg} ${it.text}`}
            >
              {it.icon}
            </span>
          </a>
        ))}
      </div>

      {/* 토글 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="상담 채널 열기"
        aria-expanded={open}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-deep text-white shadow-soft-lg transition hover:bg-rose-deep/90 active:scale-95"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.4 8.4 0 0 1-12 7.6L3 21l1.9-6A8.4 8.4 0 1 1 21 11.5Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
