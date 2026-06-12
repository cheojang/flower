import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminNav from "@/components/admin/AdminNav";
import OrderManager from "@/components/admin/OrderManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "주문 관리" };

export default function AdminOrdersPage() {
  if (!isAdminAuthenticated()) redirect("/admin/login");

  return (
    <div className="container-soft py-10">
      <AdminNav />
      <h1 className="font-serif text-2xl text-ink">주문 관리</h1>
      <p className="mt-1 text-sm text-ink-soft">
        신규 주문의 입금을 확인하면 &quot;입금확인&quot;으로, 전달이 끝나면 &quot;완료&quot;로
        바꿔주세요.
      </p>
      <div className="mt-8">
        <OrderManager />
      </div>
    </div>
  );
}
