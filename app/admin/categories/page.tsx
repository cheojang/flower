import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import AdminNav from "@/components/admin/AdminNav";
import CategoryManager from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "카테고리 관리" };

export default async function AdminCategoriesPage() {
  if (!isAdminAuthenticated()) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="container-soft py-10">
      <AdminNav />
      <CategoryManager initialCategories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
