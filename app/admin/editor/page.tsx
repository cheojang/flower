import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import AdminNav from "@/components/admin/AdminNav";
import SiteEditor from "@/components/admin/SiteEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "사이트 편집" };

export default async function EditorPage() {
  if (!isAdminAuthenticated()) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      products: { orderBy: [{ order: "asc" }, { createdAt: "desc" }] },
    },
  });

  return (
    <div className="container-soft py-10">
      <AdminNav />
      <SiteEditor initial={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
