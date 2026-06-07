import Image from "next/image";
import { site, formatPrice } from "@/lib/config";
import Reveal from "@/components/Reveal";

export const metadata = { title: "플라워 클래스" };

const onedayItems = [
  { name: "꽃꽂이", desc: "꽃의 구조와 배치를 배우는 기초 꽃꽂이 클래스예요." },
  { name: "꽃다발", desc: "나만의 개성 있는 꽃다발을 직접 엮어보는 시간이에요." },
  { name: "테라리움", desc: "유리 용기 속 작은 정원, 테라리움을 함께 만들어요." },
];

const classes = [
  {
    name: "원데이 클래스",
    price: 55000,
    desc: "처음이어도 괜찮아요. 2시간 동안 내 손으로 완성하는 꽃 작품 한 점.",
    img: "/img/gallery-1.svg",
    sub: onedayItems,
  },
  {
    name: "테라리움 클래스",
    price: 45000,
    desc: "유리 용기 안에 이끼·소품·식물로 작은 세계를 만드는 감성 클래스예요.",
    img: "/img/gallery-4.svg",
    sub: null,
  },
  {
    name: "단체·기업 클래스",
    price: 0,
    desc: "친구 모임, 회사 워크숍을 위한 맞춤형 클래스 (인원·예산별 견적)",
    img: "/img/gallery-7.svg",
    sub: null,
  },
];

export default function ClassPage() {
  return (
    <div className="container-soft py-14">
      <Reveal className="text-center">
        <p className="label-chip">Flower Class</p>
        <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">
          꽃과 가까워지는 시간
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">
          LANN의 작업실에서 향기로운 꽃과 함께하는 따뜻한 클래스를 열고 있어요.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {classes.map((c, i) => (
          <Reveal key={c.name} delay={i * 70}>
            <div className="flex h-full flex-col overflow-hidden rounded-4xl border border-rose-light bg-white/60 shadow-soft">
              <div className="relative aspect-[4/3]">
                <Image src={c.img} alt={c.name} fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-serif text-xl text-ink">{c.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{c.desc}</p>

                {c.sub && (
                  <ul className="mt-4 space-y-2 rounded-2xl bg-cream/70 p-3">
                    {c.sub.map((s) => (
                      <li key={s.name} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 shrink-0 text-rose-deep">✦</span>
                        <div>
                          <span className="font-medium text-ink">{s.name}</span>
                          <span className="ml-1 text-ink-soft">— {s.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <p className="mt-4 font-serif text-lg text-rose-deep">
                  {c.price > 0 ? formatPrice(c.price) : "견적 문의"}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12 text-center">
        <a href={site.consult.kakaoChannel} target="_blank" rel="noreferrer" className="btn-primary">
          클래스 예약·문의하기
        </a>
      </Reveal>
    </div>
  );
}
