import Image from "next/image";
import { site, formatPrice } from "@/lib/config";
import Reveal from "@/components/Reveal";

export const metadata = { title: "정기구독" };

const plans = [
  {
    name: "데일리",
    cycle: "매주",
    price: 25000,
    desc: "작지만 매주 새로운 꽃으로 일상을 환기해요.",
    highlight: false,
  },
  {
    name: "베이직",
    cycle: "격주 (2주에 1번)",
    price: 39000,
    desc: "가장 인기 있는 구성. 풍성한 시즌 꽃다발을 정기 배송.",
    highlight: true,
  },
  {
    name: "프리미엄",
    cycle: "매월",
    price: 69000,
    desc: "특별한 공간을 위한 럭셔리 사이즈 꽃다발.",
    highlight: false,
  },
];

export default function SubscriptionPage() {
  return (
    <div>
      {/* 헤더 */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/img/banner-about.jpg"
            alt="정기구독"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream to-cream/30" />
        </div>
        <div className="container-soft relative py-24 text-center">
          <p className="label-chip">Subscription</p>
          <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">
            꽃이 오는 날을 기다리는 설렘
          </h1>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">
            매 시즌 가장 좋은 꽃으로 구성해 정기적으로 보내드려요. 언제든 건너뛰기·해지가
            가능합니다.
          </p>
        </div>
      </section>

      {/* 플랜 */}
      <section className="container-soft py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 70}>
              <div
                className={`flex h-full flex-col rounded-4xl border p-8 ${
                  p.highlight
                    ? "border-rose-deep bg-rose-light/50 shadow-soft-lg"
                    : "border-rose-light bg-white/60"
                }`}
              >
                {p.highlight && (
                  <span className="mb-3 self-start rounded-full bg-rose-deep px-3 py-1 text-xs font-semibold text-white">
                    가장 인기
                  </span>
                )}
                <h3 className="font-serif text-2xl text-ink">{p.name}</h3>
                <p className="mt-1 text-sm text-ink-soft">{p.cycle} 배송</p>
                <p className="mt-4 font-serif text-3xl text-rose-deep">
                  {formatPrice(p.price)}
                  <span className="text-sm text-ink-soft"> / 회</span>
                </p>
                <p className="mt-4 flex-1 leading-relaxed text-ink-soft">{p.desc}</p>
                <a
                  href={site.consult.kakaoChannel}
                  target="_blank"
                  rel="noreferrer"
                  className={p.highlight ? "btn-primary mt-6" : "btn-ghost mt-6"}
                >
                  이 플랜으로 상담하기
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 안내 */}
      <section className="container-soft pb-20">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { t: "언제든 건너뛰기", d: "여행·출장 등 필요할 때 배송을 쉽게 건너뛸 수 있어요." },
              { t: "받는 분 변경", d: "이번 달은 나에게, 다음 달은 소중한 사람에게." },
              { t: "자유로운 해지", d: "약정 없이 부담 없는 구독, 언제든 해지 가능." },
            ].map((it) => (
              <div key={it.t} className="rounded-3xl border border-rose-light bg-white/50 p-6">
                <h4 className="font-serif text-lg text-ink">{it.t}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{it.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
