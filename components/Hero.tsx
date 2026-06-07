import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/config";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* 배경 이미지 */}
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
      </div>

      <div className="container-soft relative flex min-h-[78vh] flex-col items-center justify-center py-24 text-center">
        <p className="label-chip animate-fade-up">{site.instagramHandle}</p>
        <h1 className="mt-5 font-serif text-4xl leading-tight text-ink animate-fade-up sm:text-6xl">
          당신의 일상에 피어나는<br />작은 정원, 란뜰
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft animate-fade-up sm:text-lg">
          뜰에서 꺾어 온 듯한 싱그러움을 당신의 오늘에 선물합니다.<br className="hidden sm:block" />
          꽃 한 송이가 주는 위로, 잎사귀가 주는 평온함.
        </p>
        <div className="mt-8 flex flex-col gap-3 animate-fade-up sm:flex-row">
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
