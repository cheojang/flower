import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * 관리자 인증 (소셜 로그인과 분리된 간단한 비밀번호 방식)
 * - ADMIN_PASSWORD 와 일치하면 만료시각이 포함된 서명 쿠키를 발급합니다.
 * - 보안: 운영(NODE_ENV=production)에서는 NEXTAUTH_SECRET / ADMIN_PASSWORD 가
 *   반드시 설정돼야 합니다. 미설정 시 로그인·인증이 모두 거부됩니다(fail-closed).
 */

const COOKIE_NAME = "onsil_admin";
const isProd = process.env.NODE_ENV === "production";

// 운영에서는 환경변수 필수. 로컬(dev)에서만 기본값을 허용해 개발 편의를 제공합니다.
const SECRET = process.env.NEXTAUTH_SECRET || (isProd ? "" : "onsil-dev-secret-change-me");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (isProd ? "" : "onsil1234");
const MAX_AGE = 60 * 60 * 24 * 7; // 7일(초)

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

/** 길이 노출 없는 상수시간 비교 */
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** 비밀번호 검증 (상수시간 비교, 운영 미설정 시 거부) */
export function verifyPassword(password: string): boolean {
  if (!ADMIN_PASSWORD) return false; // 운영에서 ADMIN_PASSWORD 미설정 → 로그인 불가
  if (typeof password !== "string" || password.length === 0) return false;
  return safeEqual(password, ADMIN_PASSWORD);
}

/** 로그인 쿠키 발급 (만료시각 포함 서명) */
export function setAdminCookie() {
  if (!SECRET) throw new Error("NEXTAUTH_SECRET 가 설정되지 않았습니다.");
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `admin.${exp}`;
  const token = `${payload}.${sign(payload)}`;
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearAdminCookie() {
  cookies().delete(COOKIE_NAME);
}

/** 현재 요청이 관리자 인증 상태인지 확인 (서명 + 만료 검증) */
export function isAdminAuthenticated(): boolean {
  if (!SECRET) return false; // 시크릿 미설정 → 항상 거부(fail-closed)
  const raw = cookies().get(COOKIE_NAME)?.value;
  if (!raw) return false;

  const parts = raw.split(".");
  if (parts.length !== 3) return false;
  const [sub, expStr, sig] = parts;
  const payload = `${sub}.${expStr}`;

  if (!safeEqual(sig, sign(payload))) return false; // 서명 위조 방지
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false; // 만료 검증
  return sub === "admin";
}
