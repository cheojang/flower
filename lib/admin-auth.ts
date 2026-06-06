import { cookies } from "next/headers";
import { createHmac } from "crypto";

/**
 * 관리자 인증 (소셜 로그인과 분리된 간단한 비밀번호 방식)
 * - ADMIN_PASSWORD 환경변수와 일치하면 서명된 쿠키를 발급합니다.
 */

const COOKIE_NAME = "onsil_admin";
const SECRET = process.env.NEXTAUTH_SECRET || "onsil-dev-secret-change-me";

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

/** 비밀번호 검증 */
export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "onsil1234";
  return password === expected;
}

/** 로그인 쿠키 발급 */
export function setAdminCookie() {
  const token = sign("admin");
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7일
  });
}

export function clearAdminCookie() {
  cookies().delete(COOKIE_NAME);
}

/** 현재 요청이 관리자 인증 상태인지 확인 */
export function isAdminAuthenticated(): boolean {
  const token = cookies().get(COOKIE_NAME)?.value;
  return token === sign("admin");
}
