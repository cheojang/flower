import NextAuth, { type NextAuthConfig } from "next-auth";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

/**
 * 소셜 로그인 설정
 * - 해당 provider의 환경변수가 존재할 때만 활성화됩니다.
 * - 지금은 카카오만 키를 넣으면 동작하고, 나중에 네이버/구글 키를
 *   .env 에 추가하면 네이버·구글 로그인이 자동으로 켜집니다.
 */
const providers = [];

if (process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET) {
  providers.push(
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    })
  );
}

// ── 나중에 키만 넣으면 활성화됩니다 ──
if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
  providers.push(
    Naver({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    })
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

/** 현재 활성화된 소셜 로그인 provider id 목록 (UI에서 버튼 노출 제어용) */
export const enabledProviders = providers.map((p) =>
  typeof p === "function" ? (p as any)().id : (p as any).id
);

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
