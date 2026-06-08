"use client";

import { useRef, useState } from "react";

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
};
type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
  products: Product[];
};

export default function SiteEditor({ initial }: { initial: Category[] }) {
  const [cats, setCats] = useState<Category[]>(initial);
  const [toast, setToast] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [newCat, setNewCat] = useState("");

  function notify(msg = "저장됨") {
    setToast(msg);
    window.clearTimeout((notify as any)._t);
    (notify as any)._t = window.setTimeout(() => setToast(""), 1600);
  }

  // ── 상품 ──────────────────────────────
  async function patchProduct(catId: string, id: string, patch: Partial<Product>) {
    setCats((cs) =>
      cs.map((c) =>
        c.id === catId
          ? { ...c, products: c.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) }
          : c
      )
    );
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) notify();
    else notify("저장 실패");
  }

  async function addProduct(catId: string) {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "새 상품",
        price: 0,
        imageUrl: "",
        categoryId: catId,
        // order는 서버에서 전역 마지막 순번+1로 자동 부여
      }),
    });
    if (!res.ok) return notify("추가 실패");
    const created: Product = await res.json();
    setCats((cs) =>
      cs.map((c) => (c.id === catId ? { ...c, products: [...c.products, created] } : c))
    );
    notify("상품이 추가됐어요");
  }

  async function deleteProduct(catId: string, p: Product) {
    if (!confirm(`'${p.name}' 상품을 삭제할까요?`)) return;
    setCats((cs) =>
      cs.map((c) => (c.id === catId ? { ...c, products: c.products.filter((x) => x.id !== p.id) } : c))
    );
    await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    notify("삭제됐어요");
  }

  // ── 카테고리(메뉴) ────────────────────
  async function renameCategory(id: string, name: string) {
    setCats((cs) => cs.map((c) => (c.id === id ? { ...c, name } : c)));
    await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    notify();
  }

  async function addCategory() {
    const name = newCat.trim();
    if (!name) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, order: cats.length + 1 }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return notify(d.error ?? "추가 실패");
    }
    const created = await res.json();
    setCats((cs) => [...cs, { ...created, products: [] }]);
    setNewCat("");
    setAddingCat(false);
    notify("메뉴가 추가됐어요");
  }

  async function deleteCategory(c: Category) {
    const n = c.products.length;
    if (
      !confirm(
        n > 0
          ? `'${c.name}' 메뉴에 상품 ${n}개가 있어요. 메뉴와 상품이 함께 삭제됩니다. 계속할까요?`
          : `'${c.name}' 메뉴를 삭제할까요?`
      )
    )
      return;
    setCats((cs) => cs.filter((x) => x.id !== c.id));
    await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
    notify("메뉴가 삭제됐어요");
  }

  return (
    <div>
      {/* 안내 바 */}
      <div className="mb-8 rounded-3xl bg-sage-light/70 p-5 text-center">
        <p className="font-serif text-lg text-ink">🎨 사이트 편집 모드</p>
        <p className="mt-1 text-sm text-ink-soft">
          사진·이름·가격을 직접 눌러서 바로 수정하세요. 변경 내용은 자동 저장돼요.
          <br className="sm:hidden" /> 상품과 메뉴는 <b>＋ / －</b> 버튼으로 추가·삭제할 수 있어요.
        </p>
      </div>

      {cats.map((cat) => (
        <section key={cat.id} className="mb-14">
          {/* 카테고리 헤더 */}
          <div className="mb-5 flex items-center gap-3 border-b border-rose-light pb-3">
            <input
              defaultValue={cat.name}
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v && v !== cat.name) renameCategory(cat.id, v);
              }}
              className="min-w-0 flex-1 bg-transparent font-serif text-2xl text-ink outline-none focus:border-b focus:border-rose-deep"
              aria-label="메뉴 이름"
            />
            <span className="shrink-0 text-sm text-ink-soft">상품 {cat.products.length}</span>
            <button
              onClick={() => deleteCategory(cat)}
              title="이 메뉴 삭제"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose-deep/30 text-rose-deep transition hover:bg-rose-light"
            >
              <MinusIcon />
            </button>
          </div>

          {/* 상품 그리드 */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {cat.products.map((p) => (
              <ProductEditor
                key={p.id}
                product={p}
                onPatch={(patch) => patchProduct(cat.id, p.id, patch)}
                onDelete={() => deleteProduct(cat.id, p)}
                notify={notify}
              />
            ))}

            {/* 상품 추가 카드 */}
            <button
              onClick={() => addProduct(cat.id)}
              className="flex aspect-[4/5] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-rose-deep/30 text-rose-deep transition hover:border-rose-deep hover:bg-rose-light/40"
            >
              <PlusIcon big />
              <span className="mt-2 text-sm">상품 추가</span>
            </button>
          </div>
        </section>
      ))}

      {/* 메뉴(카테고리) 추가 */}
      <div className="mt-6 border-t border-rose-light pt-8">
        {addingCat ? (
          <div className="flex flex-wrap items-center gap-3">
            <input
              autoFocus
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              placeholder="새 메뉴 이름 (예: 드라이플라워)"
              className="flex-1 rounded-2xl border border-rose-light bg-cream px-4 py-3 text-ink outline-none focus:border-rose-deep"
            />
            <button onClick={addCategory} className="btn-primary">
              추가
            </button>
            <button onClick={() => setAddingCat(false)} className="btn-ghost">
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAddingCat(true)}
            className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-sage-deep/40 py-5 text-sage-deep transition hover:border-sage-deep hover:bg-sage-light/40"
          >
            <PlusIcon />
            <span className="font-medium">메뉴(카테고리) 추가</span>
          </button>
        )}
      </div>

      {/* 저장 토스트 */}
      <div
        className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-white shadow-soft-lg transition-all ${
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        {toast || "저장됨"} ✓
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// 상품 카드 (인라인 편집)
// ──────────────────────────────────────────────
function ProductEditor({
  product,
  onPatch,
  onDelete,
  notify,
}: {
  product: Product;
  onPatch: (patch: Partial<Product>) => void;
  onDelete: () => void;
  notify: (m?: string) => void;
}) {
  const [imgPanel, setImgPanel] = useState(false);
  const [urlDraft, setUrlDraft] = useState(product.imageUrl);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      const { url } = await res.json();
      setUrlDraft(url);
      onPatch({ imageUrl: url });
      setImgPanel(false);
    } else {
      const d = await res.json().catch(() => ({}));
      notify(d.error ?? "업로드 실패");
    }
  }

  return (
    <div className="group relative">
      {/* 삭제 버튼 */}
      <button
        onClick={onDelete}
        title="상품 삭제"
        className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-deep shadow-soft transition hover:bg-rose-deep hover:text-white"
      >
        <MinusIcon />
      </button>

      {/* 이미지 (클릭하면 변경) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-rose-light/40 shadow-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <button
          onClick={() => {
            setUrlDraft(product.imageUrl);
            setImgPanel((v) => !v);
          }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-ink/0 text-white opacity-0 transition group-hover:bg-ink/35 group-hover:opacity-100"
        >
          <CameraIcon />
          <span className="text-xs font-medium">사진 변경</span>
        </button>

        {product.isFeatured && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-rose-deep">
            추천
          </span>
        )}

        {/* 사진 변경 패널 */}
        {imgPanel && (
          <div className="absolute inset-0 flex flex-col justify-center gap-2 bg-cream/95 p-3">
            <p className="text-xs font-medium text-ink">사진 변경</p>
            <input
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="이미지 주소(URL) 붙여넣기"
              className="rounded-xl border border-rose-light bg-white px-2 py-1.5 text-xs text-ink outline-none focus:border-rose-deep"
            />
            <button
              onClick={() => {
                onPatch({ imageUrl: urlDraft });
                setImgPanel(false);
              }}
              className="rounded-full bg-rose-deep py-1.5 text-xs font-medium text-white"
            >
              주소로 적용
            </button>
            <div className="flex items-center gap-1 text-[10px] text-ink-soft">
              <span className="h-px flex-1 bg-rose-light" />또는<span className="h-px flex-1 bg-rose-light" />
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded-full border border-rose-deep/40 py-1.5 text-xs font-medium text-ink hover:bg-rose-light/60"
            >
              {uploading ? "업로드 중..." : "내 사진 업로드"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
            <button
              onClick={() => setImgPanel(false)}
              className="text-[11px] text-ink-soft underline"
            >
              닫기
            </button>
          </div>
        )}
      </div>

      {/* 이름 / 가격 (클릭해서 수정) */}
      <div className="mt-3 px-1">
        <input
          defaultValue={product.name}
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (v && v !== product.name) onPatch({ name: v });
          }}
          className="w-full bg-transparent font-medium text-ink outline-none focus:border-b focus:border-rose-deep"
          aria-label="상품 이름"
        />
        <div className="mt-1 flex items-center gap-1">
          <input
            type="number"
            defaultValue={product.price}
            onBlur={(e) => {
              const v = Number(e.target.value);
              if (v !== product.price) onPatch({ price: v });
            }}
            className="w-28 bg-transparent font-serif text-ink outline-none focus:border-b focus:border-rose-deep"
            aria-label="가격"
          />
          <span className="font-serif text-ink">원</span>
        </div>

        {/* 옵션: 뱃지 / 추천 */}
        <div className="mt-2 flex items-center gap-2">
          <input
            defaultValue={product.badge ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (product.badge ?? "")) onPatch({ badge: v });
            }}
            placeholder="뱃지"
            className="w-16 rounded-full border border-rose-light bg-white/60 px-2 py-1 text-[11px] text-ink outline-none focus:border-rose-deep"
          />
          <button
            onClick={() => onPatch({ isFeatured: !product.isFeatured })}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
              product.isFeatured
                ? "bg-rose-deep text-white"
                : "border border-rose-deep/30 text-ink-soft hover:bg-rose-light"
            }`}
          >
            ★ 추천
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 아이콘 ──
function PlusIcon({ big = false }: { big?: boolean }) {
  const s = big ? 28 : 18;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function MinusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M5 12h14" />
    </svg>
  );
}
function CameraIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.2l1-1.6A1 1 0 0 1 9.5 4h5a1 1 0 0 1 .85.4L16.3 6h2.2A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5Z" />
      <circle cx="12" cy="13" r="3.4" />
    </svg>
  );
}
