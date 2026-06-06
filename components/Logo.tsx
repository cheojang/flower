import { site } from "@/lib/config";

/**
 * 온실(ONSIL) 로고 — 미니멀 라인아트 꽃 심볼 + 워드마크
 * 색상은 currentColor / Tailwind 토큰을 사용해 어디서든 톤을 맞춥니다.
 */
export default function Logo({
  className = "",
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* 꽃잎 */}
        <g stroke="#D9A7A7" strokeWidth="1.6">
          <path d="M24 23c0-5-3-8-3-12 0-2.5 1.4-4 3-4s3 1.5 3 4c0 4-3 7-3 12Z" fill="#F4E3E3" />
          <path d="M24 23c3.5-3.6 7.6-4.4 10.4-7.2 1.8-1.8 1.8-3.8.7-4.9-1.1-1.1-3.1-1.1-4.9.7C27.4 14.4 26.6 18.5 24 23Z" fill="#F4E3E3" />
          <path d="M24 23c-3.5-3.6-7.6-4.4-10.4-7.2-1.8-1.8-1.8-3.8-.7-4.9 1.1-1.1 3.1-1.1 4.9.7C20.6 14.4 21.4 18.5 24 23Z" fill="#F4E3E3" />
          <path d="M24 23c5 0 8 3 12 3 2.5 0 4-1.4 4-3s-1.5-3-4-3c-4 0-7 3-12 3Z" fill="#EEE9F3" />
          <path d="M24 23c-5 0-8 3-12 3-2.5 0-4-1.4-4-3s1.5-3 4-3c4 0 7 3 12 3Z" fill="#EEE9F3" />
        </g>
        {/* 꽃 중심 */}
        <circle cx="24" cy="23" r="3.2" fill="#D9A7A7" />
        {/* 줄기 */}
        <path d="M24 26v15" stroke="#A8B89F" strokeWidth="1.6" strokeLinecap="round" />
        {/* 잎 */}
        <path d="M24 34c-3-1-5.5-.5-7 1.5 2.4 1.2 5 .8 7-1.5Z" fill="#C7D2C0" />
      </svg>
      {showText && (
        <span className="font-serif text-xl leading-none tracking-tight text-ink">
          {site.name}
          <span className="ml-1 align-text-top text-[10px] font-sans font-medium tracking-[0.2em] text-ink-soft">
            {site.nameEn}
          </span>
        </span>
      )}
    </span>
  );
}
