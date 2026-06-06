import Image from "next/image";
import { site, formatPrice } from "@/lib/config";
import Reveal from "@/components/Reveal";

export const metadata = { title: "꽃꽂이 강습" };

const courses = [
  {
    name: "동양 꽃꽂이 입문",
    price: 60000,
    desc: "화기에 선·여백을 살려 꽂는 전통 꽃꽂이의 기본을 배웁니다. 도구 일체 제공.",
    img: "/img/lesson-1.svg",
    tag: "입문",
  },
  {
    name: "서양 꽃꽂이 (어레인지먼트)",
    price: 65000,
    desc: "오아시스를 활용해 풍성한 라운드형·돔형 어레인지먼트를 완성해요.",
    img: "/img/lesson-2.svg",
    tag: "인기",
  },
  {
    name: "정규반 · 자격증 과정",
    price: 320000,
    desc: "꽃꽂이 지도사 자격을 목표로 8주간 체계적으로 배우는 심화 과정.",
    img: "/img/lesson-3.svg",
    tag: "자격증",
  },
];

const points = [
  { t: "소수 정예", d: "최대 4인 클래스로 한 분 한 분 꼼꼼하게 봐드려요." },
  { t: "재료 일체 제공", d: "생화·화기·도구가 모두 포함, 빈손으로 오세요." },
  { t: "작품 포장 제공", d: "완성한 작품은 예쁘게 포장해 가져가실 수 있어요." },
];

export default function LessonPage() {
  return (
    <div>
      {/* 헤더 배너 */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/img/banner-sub.svg" alt="꽃꽂이 강습" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-cream to-cream/30" />
        </div>
        <div className="container-soft relative py-24 text-center">
          <p className="label-chip">Flower Lesson</p>
          <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">손끝으로 피우는 꽃꽂이</h1>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">
            꽃을 다루는 기본기부터 작품 완성까지, 차분한 작업실에서 꽃꽂이를 배워보세요.
          </p>
        </div>
      </section>

      {/* 강습 과정 */}
      <section className="container-soft py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {courses.map((c, i) => (
            <Reveal key={c.name} delay={i * 70}>
              <div className="flex h-full flex-col overflow-hidden rounded-4xl border border-rose-light bg-white/60 shadow-soft">
                <div className="relative aspect-[4/3]">
                  <Image src={c.img} alt={c.name} fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-rose-deep shadow-soft">
                    {c.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-xl text-ink">{c.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{c.desc}</p>
                  <p className="mt-4 font-serif text-lg text-rose-deep">{formatPrice(c.price)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 안내 포인트 */}
      <section className="container-soft pb-12">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {points.map((p) => (
              <div key={p.t} className="rounded-3xl border border-rose-light bg-white/50 p-6 text-center">
                <h4 className="font-serif text-lg text-ink">{p.t}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal className="container-soft pb-20 text-center">
        <a href={site.consult.kakaoChannel} target="_blank" rel="noreferrer" className="btn-primary">
          꽃꽂이 강습 예약·문의
        </a>
      </Reveal>
    </div>
  );
}
