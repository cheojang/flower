import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/config";
import OrderForm from "@/components/OrderForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "주문하기" };

export default async function OrderPage({
  params,
}: {
  params: { productId: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    include: { category: { select: { name: true } } },
  });
  if (!product) notFound();

  return (
    <div className="container-soft max-w-2xl py-10">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href={`/shop/${product.id}`} className="hover:text-ink">
          ← 상품으로 돌아가기
        </Link>
      </nav>

      <h1 className="font-serif text-3xl text-ink">주문하기</h1>

      {/* 주문 상품 요약 */}
      <div className="mt-6 flex items-center gap-4 rounded-3xl border border-rose-light bg-white/60 p-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-rose-light/40">
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          )}
        </div>
        <div>
          <p className="text-xs text-ink-soft">{product.category.name}</p>
          <p className="font-serif text-lg text-ink">{product.name}</p>
          <p className="font-serif text-rose-deep">{formatPrice(product.price)}</p>
        </div>
      </div>

      <div className="mt-8">
        <OrderForm
          productId={product.id}
          productName={product.name}
          price={product.price}
        />
      </div>
    </div>
  );
}
