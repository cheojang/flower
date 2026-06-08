import Link from "next/link";
import { auth, signOut } from "@/auth";
import { navLinks } from "@/lib/config";
import Logo from "./Logo";
import MobileNav from "./MobileNav";

export default async function Header() {
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <header className="sticky top-0 z-30 border-b border-rose-light/70 bg-cream/85 backdrop-blur">
      <div className="container-soft flex h-16 items-center justify-between">
        <Link href="/" aria-label="온실 홈">
          <Logo />
        </Link>

        {/* 데스크탑 내비 */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-full px-4 py-2 font-serif text-[17px] text-ink transition hover:bg-rose-light/60"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 데스크탑 로그인 영역 */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href="/mypage"
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-ink hover:bg-rose-light/60"
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage text-xs text-white">
                    {(user.name ?? "님")[0]}
                  </span>
                )}
                <span className="max-w-[8rem] truncate">{user.name ?? "마이페이지"}</span>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="text-sm text-ink-soft hover:text-ink">로그아웃</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn-primary px-5 py-2">
              로그인
            </Link>
          )}
        </div>

        <MobileNav user={user} />
      </div>
    </header>
  );
}
