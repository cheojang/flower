// 페이지 이동 중 즉시 표시되는 로딩 화면
// (버튼을 누르면 바로 이 화면이 떠서 "눌렸다"는 피드백을 줍니다)
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <svg
        width="44"
        height="44"
        viewBox="0 0 48 48"
        fill="none"
        className="animate-spin"
        style={{ animationDuration: "1.6s" }}
        aria-hidden="true"
      >
        <g stroke="#D9A7A7" strokeWidth="1.6">
          <path d="M24 23c0-5-3-8-3-12 0-2.5 1.4-4 3-4s3 1.5 3 4c0 4-3 7-3 12Z" fill="#F4E3E3" />
          <path d="M24 23c3.5-3.6 7.6-4.4 10.4-7.2 1.8-1.8 1.8-3.8.7-4.9-1.1-1.1-3.1-1.1-4.9.7C27.4 14.4 26.6 18.5 24 23Z" fill="#F4E3E3" />
          <path d="M24 23c-3.5-3.6-7.6-4.4-10.4-7.2-1.8-1.8-1.8-3.8-.7-4.9 1.1-1.1 3.1-1.1 4.9.7C20.6 14.4 21.4 18.5 24 23Z" fill="#F4E3E3" />
          <path d="M24 23c5 0 8 3 12 3 2.5 0 4-1.4 4-3s-1.5-3-4-3c-4 0-7 3-12 3Z" fill="#EEE9F3" />
          <path d="M24 23c-5 0-8 3-12 3-2.5 0-4-1.4-4-3s1.5-3 4-3c4 0 7 3 12 3Z" fill="#EEE9F3" />
        </g>
        <circle cx="24" cy="23" r="3.2" fill="#D9A7A7" />
      </svg>
      <p className="font-serif text-ink-soft">꽃을 준비하고 있어요...</p>
    </div>
  );
}
