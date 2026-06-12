import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { site, formatPrice } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "주문 완료" };

const RECEIVE_LABEL: Record<string, string> = {
  pickup: "매장 픽업",
  delivery: "배송",
};

export default async function OrderCompletePage({
  params,
}: {
  params: { orderNo: string };
}) {
  const order = await prisma.order.findUnique({
    where: { orderNo: params.orderNo },
  });
  if (!order) notFound();

  const when = new Date(order.desiredAt);
  const whenText = `${when.getFullYear()}.${when.getMonth() + 1}.${when.getDate()} ${String(
    when.getHours()
  ).padStart(2, "0")}:${String(when.getMinutes()).padStart(2, "0")}`;

  const rows = [
    { t: "주문번호", v: order.orderNo },
    { t: "상품", v: `${order.productName} × ${order.quantity}` },
    { t: "금액", v: formatPrice(order.price * order.quantity) },
    { t: "수령 방법", v: RECEIVE_LABEL[order.receiveType] ?? order.receiveType },
    { t: `희망 ${order.receiveType === "pickup" ? "픽업" : "배송"} 일시`, v: whenText },
    ...(order.address ? [{ t: "배송 주소", v: order.address }] : []),
    ...(order.cardMessage ? [{ t: "카드 문구", v: order.cardMessage }] : []),
  ];

  return (
    <div className="container-soft max-w-2xl py-14 text-center">
      <p className="text-5xl" aria-hidden="true">
        💐
      </p>
      <h1 className="mt-4 font-serif text-3xl text-ink">주문이 접수되었어요</h1>
      <p className="mt-3 leading-relaxed text-ink-soft">
        아래 계좌로 입금해 주시면 확인 후 제작을 시작해요.
        <br />
        입금자명은 주문하신 분 성함과 동일하게 부탁드려요.
      </p>

      {/* 입금 안내 */}
      <div className="mt-8 rounded-3xl bg-sage-light/60 p-6">
        <p className="text-sm text-ink-soft">입금 계좌</p>
        <p className="mt-2 font-serif text-xl text-ink">
          {site.bankAccount.bank} {site.bankAccount.number}
        </p>
        <p className="mt-1 text-sm text-ink-soft">예금주: {site.bankAccount.holder}</p>
        <p className="mt-3 font-serif text-2xl text-rose-deep">
          {formatPrice(order.price * order.quantity)}
        </p>
      </div>

      {/* 주문 내역 */}
      <div className="mt-6 rounded-3xl border border-rose-light bg-white/60 p-6 text-left">
        {rows.map((r) => (
          <div
            key={r.t}
            className="flex items-start justify-between gap-4 border-b border-rose-light/60 py-2.5 text-sm last:border-0"
          >
            <span className="shrink-0 text-ink-soft">{r.t}</span>
            <span className="text-right font-medium text-ink">{r.v}</span>
          </div>
        ))}
      </div>

      {/* 다음 행동 */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={site.consult.kakaoChannel}
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          카톡으로 입금 확인 보내기
        </a>
        <a href={`tel:${site.phone}`} className="btn-ghost">
          전화 문의 {site.phone}
        </a>
      </div>
      <p className="mt-4 text-xs text-ink-soft">
        주문번호 <span className="font-medium text-ink">{order.orderNo}</span> 를 말씀해
        주시면 빠르게 확인해 드려요.
      </p>

      <Link href="/shop" className="mt-8 inline-block text-sm text-ink-soft hover:text-ink">
        계속 둘러보기 →
      </Link>
    </div>
  );
}
