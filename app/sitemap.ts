import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { site } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;

  // 고정 페이지
  const staticPaths = ["", "/shop", "/class", "/about", "/contact", "/subscription"];
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  // 상품 상세 페이지 (DB 접근 실패해도 사이트맵은 반환)
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({ select: { id: true, createdAt: true } });
    productEntries = products.map((p) => ({
      url: `${base}/shop/${p.id}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    productEntries = [];
  }

  return [...staticEntries, ...productEntries];
}
