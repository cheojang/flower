import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: { select: { name: true } } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const body = await req.json();
  const { name, description, price, imageUrl, badge, isFeatured, order, categoryId } = body;

  if (!name || !categoryId || price == null) {
    return NextResponse.json({ error: "이름, 가격, 카테고리는 필수입니다." }, { status: 400 });
  }

  // 순서(order)를 지정하지 않으면 전체 상품의 마지막 순번 다음으로 자동 부여
  let resolvedOrder = Number(order);
  if (!Number.isFinite(resolvedOrder) || resolvedOrder <= 0) {
    const last = await prisma.product.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    resolvedOrder = (last?.order ?? 0) + 1;
  }

  const product = await prisma.product.create({
    data: {
      name,
      description: description ?? "",
      price: Number(price),
      imageUrl: imageUrl ?? "",
      badge: badge || null,
      isFeatured: Boolean(isFeatured),
      order: resolvedOrder,
      categoryId,
    },
  });
  return NextResponse.json(product, { status: 201 });
}
