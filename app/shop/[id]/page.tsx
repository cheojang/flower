import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { site, formatPrice } from "@/lib/config";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    include: { category: { select: { name: true } } },
    take: 4,
    orderBy: { order: "asc" },
  });

  return (
    <div className="container-soft py-10">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/shop" className="hover:text-ink">
          상품
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-ink">
          {product.category.name}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-4xl bg-rose-light/40 shadow-soft">
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          )}
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-rose-deep shadow-soft">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-sm text-ink-soft">{product.category.name}</p>
          <h1 className="mt-2 font-serif text-3xl text-ink">{product.name}</h1>
          <p className="mt-4 font-serif text-2xl text-rose-deep">
            {formatPrice(product.price)}
          </p>
          <p className="mt-6 whitespace-pre-line leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <div className="mt-8 rounded-3xl bg-sage-light/60 p-5 text-sm leading-relaxed text-ink-soft">
            <p>· 꽃은 시즌·수급 상황에 따라 비슷한 톤으로 대체될 수 있어요.</p>
            <p>· 색상/사이즈 변경, 카드 문구는 상담으로 요청해 주세요.</p>
          </div>

          {/* 주문/상담 CTA */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={site.consult.kakaoChannel}
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex-1"
            >
              카카오톡으로 주문 상담
            </a>
            <a
              href={site.consult.naverTalk}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost flex-1"
            >
              네이버 톡톡 상담
            </a>
          </div>
          <a
            href={`tel:${site.phone}`}
            className="mt-3 text-center text-sm text-ink-soft hover:text-ink"
          >
            전화 주문 {site.phone}
          </a>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-6">함께 보면 좋은 꽃</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
