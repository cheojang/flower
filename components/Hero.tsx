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
          src="/img/hero-v3.jpg"
          alt="파스텔 톤 꽃다발"
          fill
          priority
          sizes="100vw"
          className="object-cover object-left"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-cream/10" />
        {/* 계절 틴트 — 상단을 계절 색으로 물들임 (고정 분홍 오버레이 제거) */}
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{ background: seasonTint[season] }}
        />
        {/* 텍스트 가독성용 소프트 스크림 (가운데를 은은히 밝혀 글씨를 띄움) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(75% 60% at 50% 46%, rgba(255,251,247,0.72) 0%, rgba(255,251,247,0.30) 45%, rgba(255,251,247,0) 75%)",
          }}
        />
      </div>

      {/* 계절 애니메이션 (모바일=CSS, PC=JS / 배경 위·콘텐츠 아래) */}
      <SeasonalAnimation season={season} />

      {/* 콘텐츠 (최상위 z-10 — 버튼이 항상 우선 조작됨) */}
      <div
        className="container-soft relative z-10 flex flex-col items-center justify-center py-24 text-center"
        style={{ minHeight: "85vh" }}
      >
        <h1
          className="mt-5 font-serif text-4xl font-medium leading-tight text-ink animate-fade-up sm:text-6xl"
          style={{ textShadow: "0 1px 16px rgba(255,251,247,0.95), 0 1px 3px rgba(255,251,247,0.9)" }}
        >
          당신의 일상에 피어나는<br />작은 정원, 란뜰
        </h1>
        <p
          className="mt-5 max-w-lg font-serif text-lg leading-relaxed text-ink animate-fade-up sm:text-xl"
          style={{ textShadow: "0 1px 12px rgba(255,251,247,0.95)" }}
        >
          뜰에서 꺾어 온 듯한 싱그러움을 당신의 오늘에 선물합니다.
        </p>
        <p
          className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft animate-fade-up"
          style={{ textShadow: "0 1px 10px rgba(255,251,247,0.95)" }}
        >
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
