"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/editor", label: "✨ 사이트 편집" },
  { href: "/admin/products", label: "상품 목록" },
  { href: "/admin/categories", label: "카테고리" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-rose-light pb-4 sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex flex-wrap gap-2">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-2 text-sm transition ${
                active
                  ? "bg-rose-deep text-white"
                  : "border border-rose-deep/30 bg-white/60 text-ink hover:bg-rose-light"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-3">
        <Link href="/" target="_blank" className="text-sm text-ink-soft hover:text-ink">
          사이트 보기 ↗
        </Link>
        <button onClick={logout} className="text-sm text-ink-soft hover:text-ink">
          로그아웃
        </button>
      </div>
    </div>
  );
}
