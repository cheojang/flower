import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export const metadata = { title: "상품" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeSlug = searchParams.category ?? "all";

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({
      where:
        activeSlug === "all"
          ? {}
          : { category: { slug: activeSlug } },
      include: { category: { select: { name: true } } },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  const tabs = [{ slug: "all", name: "전체" }, ...categories];

  return (
    <div className="container-soft py-12">
      <Reveal className="text-center">
        <p className="label-chip">Shop</p>
        <h1 className="section-title mt-3">온실의 꽃</h1>
        <p className="mt-2 text-sm text-ink-soft">
          마음을 전하고 싶은 순간, 어울리는 꽃을 골라보세요
        </p>
      </Reveal>

      {/* 카테고리 필터 */}
      <div className="my-8 flex flex-wrap justify-center gap-2">
        {tabs.map((t) => {
          const active = t.slug === activeSlug;
          return (
            <Link
              key={t.slug}
              href={t.slug === "all" ? "/shop" : `/shop?category=${t.slug}`}
              className={`rounded-full px-4 py-2 text-sm transition ${
                active
                  ? "bg-rose-deep text-white shadow-soft"
                  : "border border-rose-deep/30 bg-white/60 text-ink hover:bg-rose-light"
              }`}
            >
              {t.name}
            </Link>
          );
        })}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 40}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-ink-soft">
          해당 카테고리에 등록된 상품이 없어요.
        </p>
      )}
    </div>
  );
}
