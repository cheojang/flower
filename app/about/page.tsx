import Image from "next/image";
import { site } from "@/lib/config";
import Reveal from "@/components/Reveal";

export const metadata = { title: "브랜드 스토리" };

export default function AboutPage() {
  return (
    <div className="container-soft py-14">
      <Reveal className="text-center">
        <p className="label-chip">Story</p>
        <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">{site.tagline}</h1>
      </Reveal>

      <Reveal className="mx-auto mt-10 max-w-2xl text-center leading-loose text-ink-soft">
        <p>
          {site.name}은 따뜻한 햇살이 머무는 작은 꽃집입니다.
          <br />
          우리는 화려함보다 ‘오래 곁에 두고 싶은’ 다정함을 담고 싶었어요.
        </p>
        <p className="mt-6">
          계절이 바뀔 때마다 가장 좋은 꽃을 골라
          <br />
          당신의 하루에 작은 위로와 설렘을 더합니다.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <div className="relative aspect-[16/9] overflow-hidden rounded-4xl shadow-soft">
          <Image
            src="https://images.unsplash.com/photo-1471696035578-3d8c78d99684?w=1600&q=80"
            alt="온실 작업실"
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
