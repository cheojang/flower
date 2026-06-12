"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/config";

type Order = {
  id: string;
  orderNo: string;
  productName: string;
  price: number;
  quantity: number;
  customerName: string;
  phone: string;
  receiveType: string;
  desiredAt: string;
  address: string;
  cardMessage: string;
  request: string;
  status: string;
  createdAt: string;
};

const STATUS_META: Record<string, { label: string; cls: string }> = {
  NEW: { label: "신규", cls: "bg-rose-light text-rose-deep" },
  CONFIRMED: { label: "입금확인", cls: "bg-sage-light text-sage-deep" },
  COMPLETED: { label: "완료", cls: "bg-cream text-ink-soft" },
  CANCELED: { label: "취소", cls: "bg-gray-100 text-gray-400" },
};

const STATUS_FLOW = ["NEW", "CONFIRMED", "COMPLETED", "CANCELED"];

function fmt(dt: string) {
  const d = new Date(dt);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/orders");
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: updated.status } : o)));
    }
  }

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <p className="py-10 text-center text-ink-soft">불러오는 중...</p>;

  return (
    <div>
      {/* 상태 필터 */}
      <div className="mb-5 flex flex-wrap gap-2">
        {[{ v: "all", label: `전체 ${orders.length}` }].concat(
          STATUS_FLOW.map((s) => ({
            v: s,
            label: `${STATUS_META[s].label} ${orders.filter((o) => o.status === s).length}`,
          }))
        ).map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              filter === f.v
                ? "bg-rose-deep text-white"
                : "border border-rose-deep/30 bg-white/60 text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="py-10 text-center text-ink-soft">주문이 없어요.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {shown.map((o) => {
            const meta = STATUS_META[o.status] ?? STATUS_META.NEW;
            const open = openId === o.id;
            return (
              <div
                key={o.id}
                className="rounded-3xl border border-rose-light bg-white/60 p-4 sm:p-5"
              >
                {/* 요약 줄 (모바일 우선 카드) */}
                <button
                  className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 text-left"
                  onClick={() => setOpenId(open ? null : o.id)}
                >
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.cls}`}>
                    {meta.label}
                  </span>
                  <span className="text-xs text-ink-soft">{o.orderNo}</span>
                  <span className="font-medium text-ink">{o.productName}</span>
                  <span className="text-sm text-ink-soft">× {o.quantity}</span>
                  <span className="ml-auto font-serif text-rose-deep">
                    {formatPrice(o.price * o.quantity)}
                  </span>
                </button>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-soft">
                  <span>
                    {o.customerName} · {o.phone}
                  </span>
                  <span>
                    {o.receiveType === "pickup" ? "픽업" : "배송"} 희망 {fmt(o.desiredAt)}
                  </span>
                  <span>접수 {fmt(o.createdAt)}</span>
                </div>

                {/* 상세 + 상태 변경 */}
                {open && (
                  <div className="mt-4 border-t border-rose-light/60 pt-4 text-sm">
                    {o.address && (
                      <p className="text-ink-soft">
                        <span className="font-medium text-ink">주소</span> {o.address}
                      </p>
                    )}
                    {o.cardMessage && (
                      <p className="mt-1 text-ink-soft">
                        <span className="font-medium text-ink">카드</span> {o.cardMessage}
                      </p>
                    )}
                    {o.request && (
                      <p className="mt-1 text-ink-soft">
                        <span className="font-medium text-ink">요청</span> {o.request}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {STATUS_FLOW.filter((s) => s !== o.status).map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatus(o.id, s)}
                          className="rounded-full border border-rose-deep/30 bg-white px-3 py-1.5 text-xs text-ink transition hover:bg-rose-light"
                        >
                          → {STATUS_META[s].label}
                        </button>
                      ))}
                      <a
                        href={`tel:${o.phone}`}
                        className="ml-auto rounded-full bg-sage-deep px-3 py-1.5 text-xs text-white"
                      >
                        고객에게 전화
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
