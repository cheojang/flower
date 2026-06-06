import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/config";

export type ProductCardData = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  badge?: string | null;
  category?: { name: string } | null;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-rose-light/40 shadow-soft">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft">
            이미지 없음
          </div>
        )}
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-rose-deep shadow-soft">
            {product.badge}
          </span>
        )}
      </div>
      <div className="mt-3 px-1">
        {product.category?.name && (
          <p className="text-xs text-ink-soft">{product.category.name}</p>
        )}
        <h3 className="mt-0.5 truncate font-medium text-ink">{product.name}</h3>
        <p className="mt-1 font-serif text-ink">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
