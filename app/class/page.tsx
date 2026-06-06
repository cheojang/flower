import Image from "next/image";
import { site, formatPrice } from "@/lib/config";
import Reveal from "@/components/Reveal";

export const metadata = { title: "플라워 클래스" };

const classes = [
  {
    name: "원데이 클래스",
    price: 55000,
    desc: "처음이어도 괜찮아요. 2시간 동안 나만의 꽃다발 한 다발을 완성해요.",
    img: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=900&q=80",
  },
  {
    name: "정규 4주 과정",
    price: 200000,
    desc: "꽃 손질부터 컬러 배합, 다양한 디자인까지 차근차근 배우는 과정.",
    img: "https://images.unsplash.com/photo-1503453363464-743ee9335aea?w=900&q=80",
  },
  {
    name: "단체·기업 클래스",
    price: 0,
    desc: "친구 모임, 회사 워크숍을 위한 맞춤형 클래스 (인원·예산별 견적)",
    img: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=900&q=80",
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
          온실의 작업실에서 향기로운 꽃과 함께하는 따뜻한 클래스를 열고 있어요.
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
