import { redirect } from "next/navigation";
import { auth, signIn, enabledProviders } from "@/auth";
import Logo from "@/components/Logo";

export const metadata = { title: "로그인" };

// 소셜 로그인 버튼 정의 (Naver/Google은 키가 들어오면 자동 활성화)
const socials = [
  {
    id: "kakao",
    label: "카카오로 시작하기",
    cls: "bg-[#FEE500] text-[#3C1E1E] hover:brightness-95",
  },
  {
    id: "naver",
    label: "네이버로 시작하기",
    cls: "bg-[#03C75A] text-white hover:brightness-95",
  },
  {
    id: "google",
    label: "Google로 시작하기",
    cls: "bg-white text-ink border border-rose-light hover:bg-rose-light/40",
  },
];

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/mypage");

  return (
    <div className="container-soft flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-4xl border border-rose-light bg-white/70 p-8 text-center shadow-soft">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 font-serif text-2xl text-ink">반가워요 🌷</h1>
        <p className="mt-2 text-sm text-ink-soft">
          간편하게 로그인하고 온실의 소식을 받아보세요.
        </p>

        <div className="mt-8 space-y-3">
          {socials.map((s) => {
            const enabled = enabledProviders.includes(s.id);
            if (!enabled) {
              return (
                <button
                  key={s.id}
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-center rounded-full bg-rose-light/40 px-6 py-3 text-sm text-ink-soft"
                  title="관리자 .env에 키를 등록하면 활성화됩니다"
                >
                  {s.label} (준비 중)
                </button>
              );
            }
            return (
              <form
                key={s.id}
                action={async () => {
                  "use server";
                  await signIn(s.id, { redirectTo: "/mypage" });
                }}
              >
                <button
                  type="submit"
                  className={`flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-medium shadow-soft transition active:scale-[0.98] ${s.cls}`}
                >
                  {s.label}
                </button>
              </form>
            );
          })}
        </div>

        {enabledProviders.length === 0 && (
          <p className="mt-6 rounded-2xl bg-rose-light/50 p-3 text-xs leading-relaxed text-ink-soft">
            아직 소셜 로그인 키가 설정되지 않았어요.
            <br />
            <code>.env</code>에 KAKAO_CLIENT_ID / SECRET을 등록하면 활성화됩니다.
          </p>
        )}
      </div>
    </div>
  );
}
