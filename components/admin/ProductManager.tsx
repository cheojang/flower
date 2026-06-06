"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/config";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  badge: string | null;
  isFeatured: boolean;
  order: number;
  categoryId: string;
  category?: { name: string } | null;
};

const empty = {
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  badge: "",
  isFeatured: false,
  order: 0,
  categoryId: "",
};

export default function ProductManager({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<typeof empty>({
    ...empty,
    categoryId: categories[0]?.id ?? "",
  });
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function startCreate() {
    setEditing(null);
    setForm({ ...empty, categoryId: categories[0]?.id ?? "" });
    setError("");
    setOpen(true);
  }

  function startEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      badge: p.badge ?? "",
      isFeatured: p.isFeatured,
      order: p.order,
      categoryId: p.categoryId,
    });
    setError("");
    setOpen(true);
  }

  async function refresh() {
    const res = await fetch("/api/admin/products");
    if (res.ok) setProducts(await res.json());
    router.refresh();
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const url = editing ? `/api/admin/products/${editing.id}` : "/api/admin/products";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (res.ok) {
      setOpen(false);
      await refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "저장에 실패했습니다.");
    }
  }

  async function remove(p: Product) {
    if (!confirm(`'${p.name}' 상품을 삭제할까요?`)) return;
    const res = await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    if (res.ok) await refresh();
  }

  const input =
    "w-full rounded-2xl border border-rose-light bg-cream px-4 py-2.5 text-ink outline-none focus:border-rose-deep";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink">상품·가격 관리</h1>
          <p className="mt-1 text-sm text-ink-soft">총 {products.length}개 상품</p>
        </div>
        <button onClick={startCreate} className="btn-primary">
          + 상품 추가
        </button>
      </div>

      {categories.length === 0 && (
        <p className="mb-4 rounded-2xl bg-rose-light/50 p-4 text-sm text-ink-soft">
          먼저 ‘카테고리’ 메뉴에서 카테고리를 만들어 주세요.
        </p>
      )}

      {/* 상품 목록 — 모바일: 카드 스택 / 데스크탑: 행 */}
      <div className="space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-3xl border border-rose-light bg-white/60 p-4 sm:flex-row sm:items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.imageUrl || "/placeholder.svg"}
              alt=""
              className="h-20 w-20 shrink-0 rounded-2xl bg-rose-light/40 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-ink">{p.name}</h3>
                {p.isFeatured && <span className="label-chip">추천</span>}
                {p.badge && (
                  <span className="rounded-full bg-rose-light px-2 py-0.5 text-xs text-rose-deep">
                    {p.badge}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-ink-soft">
                {p.category?.name} · {formatPrice(p.price)} · 순서 {p.order}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => startEdit(p)}
                className="rounded-full border border-rose-deep/30 px-4 py-2 text-sm text-ink hover:bg-rose-light"
              >
                수정
              </button>
              <button
                onClick={() => remove(p)}
                className="rounded-full border border-rose-deep/30 px-4 py-2 text-sm text-rose-deep hover:bg-rose-light"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 추가/수정 모달 */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-0 sm:items-center sm:p-6">
          <form
            onSubmit={save}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-4xl bg-cream p-6 shadow-soft-lg sm:rounded-4xl"
          >
            <h2 className="font-serif text-xl text-ink">
              {editing ? "상품 수정" : "상품 추가"}
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm text-ink-soft">상품명 *</label>
                <input
                  className={input}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm text-ink-soft">가격(원) *</label>
                  <input
                    type="number"
                    className={input}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-ink-soft">카테고리 *</label>
                  <select
                    className={input}
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-ink-soft">설명</label>
                <textarea
                  className={input}
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-ink-soft">이미지 URL</label>
                <input
                  className={input}
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm text-ink-soft">뱃지 (예: BEST)</label>
                  <input
                    className={input}
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-ink-soft">노출 순서</label>
                  <input
                    type="number"
                    className={input}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="h-4 w-4 accent-rose-deep"
                />
                랜딩페이지 추천 상품으로 노출
              </label>

              {error && <p className="text-sm text-rose-deep">{error}</p>}
            </div>

            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={busy} className="btn-primary flex-1">
                {busy ? "저장 중..." : "저장"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ghost flex-1"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
