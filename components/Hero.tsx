import Link from "next/link";
import Image from "next/image";
import { site, usp, seasonTint } from "@/lib/config";
import type { Season } from "@/lib/config";
import SeasonalAnimation from "@/components/SeasonalAnimation";

export default function Hero({ season }: { season: Season }) {
  return (
    <section className="relative overflow-hidden">
      {/* 배경 이미지 (가장 아래) */}
      <div className="absolute inset-0">
        <Image
          src="/img/hero.svg"
          alt="파스텔 톤 꽃다발"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-cream/10" />
        <div className="absolute inset-0 bg-rose/10" />
        {/* 계절 틴트 — 떨어지는 꽃/잎 색과 닮은 은은한 물듦 */}
        <div className="absolute inset-0" style={{ background: seasonTint[season] }} />
      </div>

      {/* 계절 애니메이션 (모바일=CSS, PC=JS / 배경 위·콘텐츠 아래) */}
      <SeasonalAnimation season={season} />

      {/* 콘텐츠 (최상위 z-10 — 버튼이 항상 우선 조작됨) */}
      <div
        className="container-soft relative z-10 flex flex-col items-center justify-center py-24 text-center"
        style={{ minHeight: "85vh" }}
      >
        <p className="label-chip animate-fade-up">🌿 {usp.badge}</p>
        <h1 className="mt-5 font-serif text-4xl leading-tight text-ink animate-fade-up sm:text-6xl">
          당신의 일상에 피어나는<br />작은 정원, 란뜰
        </h1>
        <p className="mt-5 max-w-lg font-serif text-lg leading-relaxed text-ink-soft animate-fade-up sm:text-xl">
          뜰에서 꺾어 온 듯한 싱그러움을 당신의 오늘에 선물합니다.
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft/90 animate-fade-up">
          {usp.headline} — {site.instagramHandle}
        </p>
        <div
          className="relative z-20 mt-8 flex flex-col gap-3 animate-fade-up sm:flex-row"
          style={{ pointerEvents: "auto", touchAction: "manipulation" }}
        >
          <Link href="/shop" className="btn-primary">
            꽃 보러가기
          </Link>
          <Link href="/class" className="btn-ghost">
            플라워 클래스 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
