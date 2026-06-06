import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";
export const metadata = { title: "관리자" };

export default async function AdminDashboard() {
  if (!isAdminAuthenticated()) redirect("/admin/login");

  const [productCount, categoryCount, featuredCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { isFeatured: true } }),
  ]);

  const stats = [
    { t: "전체 상품", v: productCount, href: "/admin/products" },
    { t: "카테고리", v: categoryCount, href: "/admin/categories" },
    { t: "추천(랜딩 노출)", v: featuredCount, href: "/admin/products" },
  ];

  return (
    <div className="container-soft py-10">
      <AdminNav />
      <h1 className="font-serif text-2xl text-ink">대시보드</h1>
      <p className="mt-1 text-sm text-ink-soft">온실 상품과 메뉴를 한곳에서 관리하세요.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.t}
            href={s.href}
            className="rounded-3xl border border-rose-light bg-white/60 p-6 transition hover:shadow-soft"
          >
            <p className="text-sm text-ink-soft">{s.t}</p>
            <p className="mt-2 font-serif text-3xl text-ink">{s.v}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-3xl bg-sage-light/60 p-6">
        <h2 className="font-serif text-lg text-ink">✨ 사이트 편집 모드 (추천)</h2>
        <p className="mt-1 text-sm text-ink-soft">
          실제 홈페이지 화면 그대로, 사진·가격을 직접 눌러 수정하고 ＋／－ 버튼으로 상품·메뉴를
          추가·삭제할 수 있어요.
        </p>
        <Link href="/admin/editor" className="btn-primary mt-4">
          사이트 편집 시작하기
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/products" className="btn-ghost">
          상품 목록(표) 보기
        </Link>
        <Link href="/admin/categories" className="btn-ghost">
          카테고리 관리
        </Link>
      </div>
    </div>
  );
}
