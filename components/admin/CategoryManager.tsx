"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
  _count?: { products: number };
};

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const input =
    "rounded-2xl border border-rose-light bg-cream px-4 py-2.5 text-ink outline-none focus:border-rose-deep";

  async function refresh() {
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
    router.refresh();
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, order }),
    });
    setBusy(false);
    if (res.ok) {
      setName("");
      setSlug("");
      setOrder(0);
      await refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "추가에 실패했습니다.");
    }
  }

  async function saveRow(c: Category, newName: string, newOrder: number) {
    const res = await fetch(`/api/admin/categories/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, order: newOrder }),
    });
    if (res.ok) await refresh();
  }

  async function remove(c: Category) {
    const cnt = c._count?.products ?? 0;
    if (
      !confirm(
        cnt > 0
          ? `'${c.name}'에 상품 ${cnt}개가 있습니다. 카테고리와 소속 상품이 함께 삭제됩니다. 계속할까요?`
          : `'${c.name}' 카테고리를 삭제할까요?`
      )
    )
      return;
    const res = await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
    if (res.ok) await refresh();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink">카테고리(메뉴) 관리</h1>
      <p className="mt-1 text-sm text-ink-soft">
        상품 분류와 상점 필터에 사용되는 메뉴입니다.
      </p>

      {/* 추가 폼 */}
      <form
        onSubmit={add}
        className="mt-6 grid gap-3 rounded-3xl border border-rose-light bg-white/60 p-4 sm:grid-cols-[1fr_1fr_120px_auto]"
      >
        <input
          className={input}
          placeholder="카테고리 이름 (예: 꽃다발)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className={input}
          placeholder="slug (비우면 자동생성)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <input
          type="number"
          className={input}
          placeholder="순서"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
        />
        <button type="submit" disabled={busy} className="btn-primary">
          추가
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-rose-deep">{error}</p>}

      {/* 목록 */}
      <div className="mt-6 space-y-3">
        {categories.map((c) => (
          <CategoryRow key={c.id} category={c} onSave={saveRow} onRemove={remove} input={input} />
        ))}
      </div>
    </div>
  );
}

function CategoryRow({
  category,
  onSave,
  onRemove,
  input,
}: {
  category: Category;
  onSave: (c: Category, name: string, order: number) => void;
  onRemove: (c: Category) => void;
  input: string;
}) {
  const [name, setName] = useState(category.name);
  const [order, setOrder] = useState(category.order);
  const dirty = name !== category.name || order !== category.order;

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-rose-light bg-white/60 p-4 sm:flex-row sm:items-center">
      <input
        className={`${input} flex-1`}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <span className="text-sm text-ink-soft">순서</span>
        <input
          type="number"
          className={`${input} w-20`}
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
        />
      </div>
      <span className="text-sm text-ink-soft">
        /{category.slug} · 상품 {category._count?.products ?? 0}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(category, name, order)}
          disabled={!dirty}
          className={`rounded-full px-4 py-2 text-sm ${
            dirty
              ? "bg-rose-deep text-white"
              : "cursor-default border border-rose-light text-ink-soft"
          }`}
        >
          저장
        </button>
        <button
          onClick={() => onRemove(category)}
          className="rounded-full border border-rose-deep/30 px-4 py-2 text-sm text-rose-deep hover:bg-rose-light"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
