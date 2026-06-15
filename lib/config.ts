/**
 * ─────────────────────────────────────────────────────────────
 * 사이트 전역 설정 (브랜드 / 상담 / 연락처)
 * 이 파일의 값만 바꾸면 사이트 전반의 정보가 한 번에 변경됩니다.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  // 브랜드
  name: "LANTLE",
  nameEn: "란뜰",
  tagline: "당신의 일상에 피어나는 작은 정원, 란뜰",
  description:
    "뜰에서 꺾어 온 듯한 싱그러움을 당신의 오늘에 선물합니다.",
  instagramHandle: "@lantle.flower",
  storeName: "난과뜨락",

  // 영업 정보
  address: "서울 서초구 양재동 232 화훼센타12-15호",
  hours: "매일 10:00 - 20:00 (연중무휴)",
  phone: "02-529-4885",

  // ─────────────────────────────────────────────
  // 상담 채널 (※ 아래 값은 모두 플레이스홀더입니다)
  //   - 카카오톡 채널 채팅: 카카오톡 채널 관리자센터에서 채널 URL 확인 후 교체
  //     예) https://pf.kakao.com/_채널ID/chat
  //   - 네이버 톡톡: 네이버 톡톡 파트너센터에서 발급된 URL로 교체
  //     예) https://talk.naver.com/ct/숫자ID
  //   - 네이버 플레이스(스마트플레이스) 업체 URL로 교체
  // ─────────────────────────────────────────────
  consult: {
    kakaoChannel: "https://pf.kakao.com/_XXXXX/chat", // ← 교체
    naverTalk: "https://talk.naver.com/ct/XXXXX", // ← 교체
    naverPlace: "https://map.naver.com/v5/search/%EB%82%9C%EA%B3%BC%EB%9C%A8%EB%9D%BD", // 난과뜨락 검색
  },

  // 사이트 공개 주소 (SEO·sitemap·OG용). 실제 도메인 연결 시 환경변수로 교체하세요.
  // Vercel 환경변수 NEXT_PUBLIC_SITE_URL 이 있으면 그것을 우선 사용합니다.
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://flower-drab-zeta.vercel.app",

  // 소셜
  instagramUrl: "https://instagram.com/", // ← 교체

  // ─────────────────────────────────────────────
  // 입금 계좌 (주문서 결제 안내용 — 실제 계좌로 교체하세요)
  // 추후 PG(토스페이먼츠 등) 연동 시 카드 결제로 대체됩니다.
  // ─────────────────────────────────────────────
  bankAccount: {
    bank: "국민은행", // ← 교체
    number: "000000-00-000000", // ← 교체
    holder: "난과뜨락", // ← 교체 (예금주)
  },
} as const;

// ───────────────────────────────────────────────
// 핵심 소구점 (USP) — 양재 화훼센타 직영
// 히어로/랜딩/상품/브랜드스토리에서 공통으로 사용합니다.
// ───────────────────────────────────────────────
export const usp = {
  badge: "양재꽃시장 화훼센타 안에 있는 꽃집",
  headline: "새벽 경매 그날의 꽃, 시장 직영가로",
  sub: "매일 새벽 양재 화훼 경매에서 들어온 가장 신선한 꽃으로 만듭니다.",
  points: [
    {
      t: "새벽 경매, 당일의 꽃",
      d: "매일 새벽 경매에서 그날 들어온 꽃만 사용해요. 시들기 전의 가장 싱싱한 순간을 전합니다.",
    },
    {
      t: "중간 유통 없는 직영가",
      d: "꽃시장 안에서 바로 제작하니 유통 거품이 없어요. 같은 꽃, 더 합리적인 가격.",
    },
    {
      t: "원하는 꽃, 바로 소싱",
      d: "화훼센타의 모든 꽃과 식물을 바로 구할 수 있어요. 찾는 꽃이 있다면 맞춰드립니다.",
    },
  ],
} as const;

// 네비게이션 메뉴 (공개 페이지)
export const navLinks = [
  { href: "/shop", label: "상품" },
  { href: "/class", label: "플라워 클래스" },
  { href: "/about", label: "브랜드 스토리" },
  { href: "/contact", label: "오시는 길" },
] as const;

export function formatPrice(won: number): string {
  return won.toLocaleString("ko-KR") + "원";
}

// 사이트 버전 — 업데이트할 때마다 0.01씩 올립니다 (1.10 → 1.11 → 1.12 ...)
export const APP_VERSION = "1.26";

// ───────────────────────────────────────────────
// 랜딩페이지 계절 애니메이션
//   "auto"  → 현재 날짜(월)에 맞춰 자동 (봄 벚꽃 / 여름 꽃잎 / 가을 은행잎 / 겨울 눈)
//   특정 계절로 고정하고 싶으면 "spring" | "summer" | "autumn" | "winter" 로 변경
// ───────────────────────────────────────────────
export type Season = "spring" | "summer" | "autumn" | "winter";
export const seasonSetting: "auto" | Season = "auto";

export function getCurrentSeason(): Season {
  const m = new Date().getMonth() + 1; // 1~12
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 9) return "summer";
  if (m >= 10 && m <= 11) return "autumn";
  return "winter";
}

export function resolveSeason(): Season {
  return seasonSetting === "auto" ? getCurrentSeason() : seasonSetting;
}

// 계절별 배경 틴트 — 떨어지는 꽃/잎 색과 닮은 은은한 상단 그라데이션
// (위쪽만 살짝 물들이고 아래로 투명해져 텍스트 가독성 유지)
export const seasonTint: Record<Season, string> = {
  spring: "linear-gradient(to bottom, rgba(250,214,228,0.42) 0%, rgba(250,214,228,0) 62%)", // 연한 벚꽃
  summer: "linear-gradient(to bottom, rgba(221,214,254,0.40) 0%, rgba(221,214,254,0) 62%)", // 연보라
  autumn: "linear-gradient(to bottom, rgba(245,203,50,0.48) 0%, rgba(245,203,50,0.06) 62%)",   // 은행 노랑
  winter: "linear-gradient(to bottom, rgba(226,235,246,0.52) 0%, rgba(226,235,246,0) 62%)", // 차분한 설백
};

// 페이지 전체에 깔리는 아주 옅은 계절 워시(전반적 색감) — 카드까지 은은히 물듦
export const seasonWash: Record<Season, string> = {
  spring: "rgba(250,214,228,0.20)",
  summer: "rgba(221,214,254,0.18)",
  autumn: "rgba(245,203,50,0.26)",
  winter: "rgba(226,235,246,0.24)",
};

export const seasonLabel: Record<Season, string> = {
  spring: "🌸 봄",
  summer: "💜 여름",
  autumn: "🍁 가을",
  winter: "❄️ 겨울",
};
