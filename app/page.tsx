import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Hero from "@/components/Hero";
import InstaGallery from "@/components/InstaGallery";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true },
      include: { category: { select: { name: true } } },
      orderBy: { order: "asc" },
      take: 8,
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <Hero />

      {/* 카테고리 바로가기 */}
      <section className="container-soft py-14">
        <Reveal className="mb-8 text-center">
          <p className="label-chip">Shop</p>
          <h2 className="section-title mt-3">무엇을 찾고 계신가요?</h2>
        </Reveal>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 40}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="rounded-full border border-rose-deep/30 bg-white/60 px-5 py-2.5 text-sm text-ink transition hover:bg-rose-light"
              >
                {c.name}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 추천 상품 */}
      <section className="container-soft py-10">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <p className="label-chip">Pick</p>
            <h2 className="section-title mt-3">이번 주 추천 꽃</h2>
          </div>
          <Link href="/shop" className="text-sm text-ink-soft hover:text-ink">
            전체 보기 →
          </Link>
        </Reveal>
        {featured.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 50}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-ink-soft">
            추천 상품이 아직 없어요. 관리자에서 추천을 설정해 주세요.
          </p>
        )}
      </section>

      {/* 정기구독 티저 */}
      <section className="container-soft py-16">
        <Reveal>
          <div className="grid items-center gap-8 overflow-hidden rounded-4xl bg-sage-light p-8 sm:p-12 lg:grid-cols-2">
            <div>
              <p className="label-chip bg-white/70">Subscription</p>
              <h2 className="section-title mt-3">2주에 한 번, 꽃이 오는 즐거움</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                매 시즌 가장 예쁜 꽃으로 정성껏 구성해 정기 배송해 드려요. 부담 없는
                구독으로 일상에 작은 위로를 더하세요.
              </p>
              <Link href="/subscription" className="btn-primary mt-6">
                구독 시작하기
              </Link>
            </div>
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-soft">
              <Image
                src="https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=1000&q=80"
                alt="정기구독 꽃다발"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* 브랜드 스토리 스니펫 */}
      <section className="container-soft py-10 text-center">
        <Reveal>
          <p className="label-chip">Story</p>
          <h2 className="section-title mx-auto mt-4 max-w-2xl leading-relaxed">
            “꽃은 가장 다정한 안부 인사라고 믿어요.”
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink-soft">
            온실은 따뜻한 햇살이 머무는 작은 꽃집입니다. 화려하지 않아도 오래 곁에
            두고 싶은, 그런 꽃을 만듭니다.
          </p>
          <Link href="/about" className="btn-ghost mt-6">
            브랜드 이야기 보기
          </Link>
        </Reveal>
      </section>

      {/* 배송 안내 */}
      <section className="container-soft py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { t: "당일 배송", d: "오후 2시 이전 주문 시 당일 수령 가능 (지역별 상이)" },
            { t: "전국 택배", d: "신선함을 유지한 안전 포장으로 전국 어디든" },
            { t: "꽃 상담", d: "카카오·네이버로 1:1 맞춤 상담을 도와드려요" },
          ].map((it, i) => (
            <Reveal key={it.t} delay={i * 60}>
              <div className="rounded-3xl border border-rose-light bg-white/50 p-6">
                <h3 className="font-serif text-lg text-ink">{it.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <InstaGallery />
    </>
  );
}
