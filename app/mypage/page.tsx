import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/auth";

export const metadata = { title: "마이페이지" };

export default async function MyPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user;

  return (
    <div className="container-soft py-16">
      <div className="mx-auto max-w-xl rounded-4xl border border-rose-light bg-white/70 p-8 shadow-soft">
        <div className="flex items-center gap-4">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sage text-2xl text-white">
              {(user.name ?? "님")[0]}
            </span>
          )}
          <div>
            <h1 className="font-serif text-2xl text-ink">{user.name ?? "회원"}님</h1>
            {user.email && <p className="text-sm text-ink-soft">{user.email}</p>}
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            { t: "주문 내역", d: "준비 중이에요" },
            { t: "정기구독 관리", d: "준비 중이에요" },
            { t: "찜한 꽃", d: "준비 중이에요" },
            { t: "1:1 상담 내역", d: "준비 중이에요" },
          ].map((it) => (
            <div key={it.t} className="rounded-3xl border border-rose-light bg-cream/60 p-5">
              <h3 className="font-medium text-ink">{it.t}</h3>
              <p className="mt-1 text-xs text-ink-soft">{it.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link href="/shop" className="text-sm text-rose-deep hover:underline">
            꽃 보러가기 →
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="text-sm text-ink-soft hover:text-ink">로그아웃</button>
          </form>
        </div>
      </div>
    </div>
  );
}
