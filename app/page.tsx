import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { resolveSeason, usp, seasonWash, type Season } from "@/lib/config";
import Hero from "@/components/Hero";
import InstaGallery from "@/components/InstaGallery";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import SeasonTester from "@/components/SeasonTester";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { season?: string };
}) {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true },
      include: { category: { select: { name: true } } },
      orderBy: { order: "asc" },
      take: 8,
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  // ?season=spring|summer|autumn|winter 로 미리보기 가능 (없으면 설정값/자동)
  const valid: Season[] = ["spring", "summer", "autumn", "winter"];
  const season = valid.includes(searchParams.season as Season)
    ? (searchParams.season as Season)
    : resolveSeason();

  return (
    <div className="relative">
      {/* 전체 페이지 계절 워시 (테스트 토글로 변경) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-colors duration-700"
        style={{ background: seasonWash[season] }}
      />
      {/* ⚠️ 테스트용 계절 토글 — 추후 삭제 */}
      <SeasonTester current={season} />

      <div className="relative z-10">
      <Hero season={season} />

      {/* 양재 직영 USP — 핵심 소구점 */}
      <section className="container-soft py-14">
        <Reveal className="mb-8 text-center">
          <p className="label-chip">Why LANTLE</p>
          <h2 className="section-title mt-3">{usp.badge}</h2>
          <p className="mt-3 text-ink-soft">{usp.sub}</p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {usp.points.map((it, i) => (
            <Reveal key={it.t} delay={i * 60}>
              <div className="h-full rounded-3xl border border-sage-light bg-white/60 p-6 text-center">
                <span className="text-2xl" aria-hidden="true">
                  {["🌅", "🏷️", "🌷"][i]}
                </span>
                <h3 className="mt-3 font-serif text-lg text-ink">{it.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 카테고리 바로가기 */}
      <section className="container-soft py-14">
        <Reveal className="mb-8 text-center">
          <p className="label-chip">Shop</p>
          <h2 className="section-title mt-3">무엇을 찾고 계신가요?</h2>
        </Reveal>
        <Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className="rounded-full border border-rose-deep/30 bg-white/60 px-5 py-2.5 text-sm text-ink transition hover:bg-rose-light"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </Reveal>
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

      {/* 플라워 클래스 티저 */}
      <section className="container-soft py-16">
        <Reveal>
          <div className="grid items-center gap-8 overflow-hidden rounded-4xl bg-sage-light p-8 sm:p-12 lg:grid-cols-2">
            <div>
              <p className="label-chip bg-white/70">Flower Class</p>
              <h2 className="section-title mt-3">꽃과 가까워지는 시간</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                꽃꽂이, 꽃다발, 테라리움까지. LANTLE의 작업실에서 향기로운 꽃과 함께하는
                따뜻한 원데이 클래스를 만나보세요.
              </p>
              <Link href="/class" className="btn-primary mt-6">
                클래스 보러가기
              </Link>
            </div>
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-soft">
              <Image
                src="/img/banner-sub.jpg"
                alt="플라워 클래스"
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
            특별한 날의 화려함뿐만 아니라, 평범한 매일을 빛내줄 자연을 제안합니다.
            당신의 뜰에서 시작되는 작고 따뜻한 이야기.
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
      </div>
    </div>
  );
}
