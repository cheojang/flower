import Link from "next/link";
import { site, navLinks } from "@/lib/config";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-rose-light bg-rose-light/30">
      <div className="container-soft grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            {site.description}
          </p>
          <p className="mt-4 text-sm text-ink-soft">{site.instagramHandle}</p>
        </div>

        <div>
          <h4 className="mb-3 font-serif text-sm text-ink">바로가기</h4>
          <ul className="space-y-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ink-soft hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-serif text-sm text-ink">상담</h4>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li>
              <a href={site.consult.kakaoChannel} target="_blank" rel="noreferrer" className="hover:text-ink">
                카카오톡 상담
              </a>
            </li>
            <li>
              <a href={site.consult.naverTalk} target="_blank" rel="noreferrer" className="hover:text-ink">
                네이버 톡톡 상담
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone}`} className="hover:text-ink">
                전화 {site.phone}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-serif text-sm text-ink">매장 안내</h4>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li>{site.address}</li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-rose-light/70 py-5">
        <p className="container-soft text-center text-xs text-ink-soft">
          © {new Date().getFullYear()} {site.name} {site.nameEn}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
