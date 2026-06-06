import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import AdminNav from "@/components/admin/AdminNav";
import ProductManager from "@/components/admin/ProductManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "상품 관리" };

export default async function AdminProductsPage() {
  if (!isAdminAuthenticated()) redirect("/admin/login");

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: { select: { name: true } } },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="container-soft py-10">
      <AdminNav />
      <ProductManager
        initialProducts={JSON.parse(JSON.stringify(products))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </div>
  );
}
