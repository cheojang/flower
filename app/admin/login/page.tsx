"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "로그인에 실패했습니다.");
    }
  }

  return (
    <div className="container-soft flex min-h-[70vh] items-center justify-center py-16">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-4xl border border-rose-light bg-white/70 p-8 text-center shadow-soft"
      >
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 font-serif text-2xl text-ink">관리자 로그인</h1>
        <p className="mt-2 text-sm text-ink-soft">상품과 가격을 관리하는 공간입니다.</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="관리자 비밀번호"
          className="mt-6 w-full rounded-2xl border border-rose-light bg-cream px-4 py-3 text-ink outline-none focus:border-rose-deep"
          autoFocus
        />
        {error && <p className="mt-3 text-sm text-rose-deep">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
          {loading ? "확인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
