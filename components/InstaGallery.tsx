import Image from "next/image";
import { site } from "@/lib/config";
import Reveal from "./Reveal";

// 인스타 감성 갤러리 (피드 느낌의 정사각 그리드)
const photos = [
  "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&q=80",
  "https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=600&q=80",
  "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=600&q=80",
  "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&q=80",
  "https://images.unsplash.com/photo-1469259943454-aa100abba749?w=600&q=80",
  "https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=600&q=80",
  "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&q=80",
  "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=600&q=80",
];

export default function InstaGallery() {
  return (
    <section className="container-soft py-16 sm:py-20">
      <Reveal className="mb-8 text-center">
        <p className="label-chip">Instagram</p>
        <h2 className="section-title mt-3">{site.instagramHandle}</h2>
        <p className="mt-2 text-sm text-ink-soft">
          온실의 일상과 오늘의 꽃을 인스타그램에서 만나보세요
        </p>
      </Reveal>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {photos.map((src, i) => (
          <Reveal key={src} delay={i * 40}>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-2xl bg-rose-light/40"
            >
              <Image
                src={src}
                alt="온실 인스타그램 사진"
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-white opacity-0 transition group-hover:bg-ink/30 group-hover:opacity-100">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
