import Image from "next/image";
import { site, usp } from "@/lib/config";
import Reveal from "@/components/Reveal";

export const metadata = { title: "브랜드 스토리" };

export default function AboutPage() {
  return (
    <div className="container-soft py-14">
      <Reveal className="text-center">
        <p className="label-chip">Story</p>
        <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">{site.tagline}</h1>
      </Reveal>

      <Reveal className="mx-auto mt-10 max-w-2xl text-center font-serif text-lg leading-loose text-ink-soft">
        <p>
          란뜰(LANTLE)은 뜰에서 꺾어 온 듯한 싱그러움을 일상에 전하는 꽃집입니다.
          <br />
          화려함보다 오래 곁에 두고 싶은, 그런 꽃과 식물을 고릅니다.
        </p>
        <p className="mt-6">
          특별한 날뿐 아니라 평범한 매일을 빛내줄 자연을 제안합니다.
        </p>
      </Reveal>

      {/* 왜 양재인가 — 핵심 소구점 */}
      <Reveal className="mx-auto mt-12 max-w-2xl rounded-4xl bg-sage-light/60 p-8 text-center sm:p-10">
        <p className="label-chip bg-white/70">Why 양재</p>
        <h2 className="mt-4 font-serif text-2xl text-ink">{usp.badge}</h2>
        <p className="mt-4 font-serif leading-loose text-ink-soft">
          란뜰은 우리나라에서 가장 큰 꽃시장, 양재 화훼센타 안에 있습니다.
          <br />
          매일 새벽 경매에서 그날 들어온 꽃을 바로 받아 만들고,
          <br />
          중간 유통이 없어 같은 꽃도 더 합리적인 가격으로 드려요.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <div className="relative aspect-[16/9] overflow-hidden rounded-4xl shadow-soft">
          <Image
            src="/img/banner-about.svg"
            alt="란뜰 작업실"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {[
          { t: "제철의 꽃", d: "그 계절 가장 아름다운 꽃을 직접 고릅니다." },
          { t: "정성스런 손길", d: "한 다발 한 다발 마음을 담아 손으로 엮습니다." },
          { t: "다정한 안부", d: "꽃과 함께 따뜻한 마음까지 전해드립니다." },
        ].map((it, i) => (
          <Reveal key={it.t} delay={i * 60}>
            <div className="rounded-3xl border border-rose-light bg-white/50 p-6 text-center">
              <h3 className="font-serif text-lg text-ink">{it.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{it.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
