import { prisma } from "@/lib/db";
import { usp } from "@/lib/config";
import ShopFilter from "@/components/ShopFilter";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export const metadata = { title: "상품" };

export default async function ShopPage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({
      include: { category: { select: { name: true, slug: true } } },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  const tabs = [{ slug: "all", name: "전체" }, ...categories];

  const productData = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    imageUrl: p.imageUrl,
    badge: p.badge,
    category: p.category ? { name: p.category.name } : null,
    categorySlug: p.category?.slug ?? "",
  }));

  return (
    <div className="container-soft py-12">
      <Reveal className="text-center">
        <p className="label-chip">Shop</p>
        <h1 className="section-title mt-3">란뜰의 꽃</h1>
        <p className="mt-2 text-sm text-ink-soft">
          마음을 전하고 싶은 순간, 어울리는 꽃을 골라보세요
        </p>
        <p className="mt-3 inline-block rounded-full bg-sage-light px-4 py-1.5 text-xs font-medium text-sage-deep">
          🌿 {usp.headline}
        </p>
      </Reveal>

      <ShopFilter tabs={tabs} products={productData} />
    </div>
  );
}
