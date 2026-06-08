"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/config";

export default function MobileNav({
  user,
}: {
  user: { name?: string | null; image?: string | null } | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="메뉴 열기"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-rose-light/60"
      >
        <span className="relative block h-4 w-6">
          <span
            className={`absolute left-0 top-0 h-0.5 w-6 bg-current transition ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-[7px] h-0.5 w-6 bg-current transition ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-[14px] h-0.5 w-6 bg-current transition ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-[64px] z-40 bg-ink/20"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed inset-x-0 top-[64px] z-50 border-t border-rose-light bg-cream px-5 py-4 shadow-soft-lg">
            <ul className="flex flex-col">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3.5 font-serif text-lg text-ink hover:bg-rose-light/60"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 border-t border-rose-light pt-2">
                {user ? (
                  <Link
                    href="/mypage"
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3.5 text-base text-ink hover:bg-rose-light/60"
                  >
                    마이페이지 {user.name ? `· ${user.name}` : ""}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3.5 text-base font-medium text-rose-deep hover:bg-rose-light/60"
                  >
                    로그인 / 회원가입
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
