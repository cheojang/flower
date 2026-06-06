/**
 * ─────────────────────────────────────────────────────────────
 * 사이트 전역 설정 (브랜드 / 상담 / 연락처)
 * 이 파일의 값만 바꾸면 사이트 전반의 정보가 한 번에 변경됩니다.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  // 브랜드
  name: "온실",
  nameEn: "ONSIL",
  tagline: "당신의 계절을 피우다",
  description:
    "온실은 따뜻한 햇살이 머무는 작은 꽃집입니다. 계절마다 가장 예쁜 꽃으로 당신의 하루를 피워드려요.",
  instagramHandle: "@onsil.flower",

  // 영업 정보
  address: "서울특별시 어딘가 꽃길 12, 1층",
  hours: "매일 10:00 - 20:00 (연중무휴)",
  phone: "010-0000-0000", // ← 실제 전화번호로 교체하세요

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
    naverPlace: "https://map.naver.com/", // ← 교체
  },

  // 소셜
  instagramUrl: "https://instagram.com/", // ← 교체
} as const;

// 네비게이션 메뉴 (공개 페이지)
export const navLinks = [
  { href: "/shop", label: "상품" },
  { href: "/subscription", label: "정기구독" },
  { href: "/class", label: "플라워 클래스" },
  { href: "/lesson", label: "꽃꽂이 강습" },
  { href: "/about", label: "브랜드 스토리" },
  { href: "/contact", label: "오시는 길" },
] as const;

export function formatPrice(won: number): string {
  return won.toLocaleString("ko-KR") + "원";
}

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
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "autumn";
  return "winter";
}

export function resolveSeason(): Season {
  return seasonSetting === "auto" ? getCurrentSeason() : seasonSetting;
}
