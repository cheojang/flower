import { site } from "@/lib/config";
import Reveal from "@/components/Reveal";

export const metadata = { title: "오시는 길" };

export default function ContactPage() {
  const channels = [
    {
      label: "카카오톡 상담",
      sub: "가장 빠른 1:1 상담",
      href: site.consult.kakaoChannel,
      cls: "bg-[#FEE500] text-[#3C1E1E]",
    },
    {
      label: "네이버 톡톡",
      sub: "네이버로 편하게 문의",
      href: site.consult.naverTalk,
      cls: "bg-[#03C75A] text-white",
    },
    {
      label: `전화 ${site.phone}`,
      sub: "바로 통화 상담",
      href: `tel:${site.phone}`,
      cls: "bg-sage-deep text-white",
    },
  ];

  return (
    <div className="container-soft py-14">
      <Reveal className="text-center">
        <p className="label-chip">Contact</p>
        <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">오시는 길 · 상담</h1>
        <p className="mt-4 text-ink-soft">언제든 편하게 문의해 주세요 🌷</p>
      </Reveal>

      {/* 상담 채널 */}
      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
        {channels.map((c, i) => (
          <Reveal key={c.label} delay={i * 60}>
            <a
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className={`flex h-full flex-col items-center justify-center rounded-3xl p-6 text-center shadow-soft transition hover:opacity-90 ${c.cls}`}
            >
              <span className="font-medium">{c.label}</span>
              <span className="mt-1 text-xs opacity-80">{c.sub}</span>
            </a>
          </Reveal>
        ))}
      </div>

      {/* 매장 정보 */}
      <Reveal className="mx-auto mt-12 max-w-3xl">
        <div className="grid gap-6 rounded-4xl border border-rose-light bg-white/60 p-8 sm:grid-cols-2">
          <div>
            <h3 className="font-serif text-lg text-ink">매장 위치</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{site.address}</p>
            <a
              href={site.consult.naverPlace}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm text-rose-deep hover:underline"
            >
              네이버 지도에서 보기 →
            </a>
          </div>
          <div>
            <h3 className="font-serif text-lg text-ink">영업 시간</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{site.hours}</p>
            <p className="mt-3 text-sm text-ink-soft">{site.instagramHandle}</p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
