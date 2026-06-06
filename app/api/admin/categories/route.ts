import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

function slugify(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/[^\w가-힣-]+/g, "-")
      .replace(/^-+|-+$/g, "") || `cat-${Date.now()}`
  );
}

export async function POST(req: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const { name, slug, order } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "이름은 필수입니다." }, { status: 400 });
  }
  const finalSlug = slug?.trim() ? slugify(slug) : slugify(name);

  const exists = await prisma.category.findUnique({ where: { slug: finalSlug } });
  if (exists) {
    return NextResponse.json({ error: "이미 존재하는 slug입니다." }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: { name, slug: finalSlug, order: Number(order) || 0 },
  });
  return NextResponse.json(category, { status: 201 });
}
