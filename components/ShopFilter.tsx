"use client";

import { useState } from "react";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";

type Product = ProductCardData & { categorySlug: string };
type Tab = { slug: string; name: string };

export default function ShopFilter({
  tabs,
  products,
}: {
  tabs: Tab[];
  products: Product[];
}) {
  const [active, setActive] = useState("all");

  const filtered =
    active === "all"
      ? products
      : products.filter((p) => p.categorySlug === active);

  return (
    <>
      {/* 카테고리 필터 (클라이언트 즉시 전환) */}
      <div className="my-8 flex flex-wrap justify-center gap-2">
        {tabs.map((t) => {
          const isActive = t.slug === active;
          return (
            <button
              key={t.slug}
              type="button"
              onClick={() => setActive(t.slug)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                isActive
                  ? "bg-rose-deep text-white shadow-soft"
                  : "border border-rose-deep/30 bg-white/60 text-ink hover:bg-rose-light"
              }`}
            >
              {t.name}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {filtered.map((p) => (
            <div key={p.id} className="animate-fade-up">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-ink-soft">
          해당 카테고리에 등록된 상품이 없어요.
        </p>
      )}
    </>
  );
}
