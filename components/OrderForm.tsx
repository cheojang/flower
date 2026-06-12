"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/config";

type Props = {
  productId: string;
  productName: string;
  price: number;
};

export default function OrderForm({ productId, productName, price }: Props) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [receiveType, setReceiveType] = useState<"pickup" | "delivery">("pickup");
  const [desiredDate, setDesiredDate] = useState("");
  const [desiredTime, setDesiredTime] = useState("12:00");
  const [address, setAddress] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const [request, setRequest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 오늘 이후만 선택 가능
  const minDate = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  }, []);

  const total = price * quantity;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!customerName.trim()) return setError("주문하시는 분 성함을 입력해 주세요.");
    if (!phone.trim()) return setError("연락처를 입력해 주세요.");
    if (!desiredDate) return setError("희망 날짜를 선택해 주세요.");
    if (receiveType === "delivery" && !address.trim())
      return setError("배송 주소를 입력해 주세요.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
          customerName,
          phone,
          receiveType,
          desiredAt: `${desiredDate}T${desiredTime}:00`,
          address,
          cardMessage,
          request,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "주문 접수에 실패했어요. 다시 시도해 주세요.");
        setSubmitting(false);
        return;
      }
      router.push(`/order/complete/${data.orderNo}`);
    } catch {
      setError("네트워크 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full rounded-2xl border border-rose-light bg-white/70 px-4 py-3 text-sm text-ink outline-none transition focus:border-rose-deep/50";
  const labelCls = "mb-1.5 block text-sm font-medium text-ink";

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {/* 수량 */}
      <div>
        <label className={labelCls}>수량</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-deep/30 text-lg text-ink active:scale-90"
            aria-label="수량 줄이기"
          >
            −
          </button>
          <span className="w-8 text-center font-medium text-ink">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-deep/30 text-lg text-ink active:scale-90"
            aria-label="수량 늘리기"
          >
            ＋
          </button>
          <span className="ml-auto font-serif text-lg text-rose-deep">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* 주문자 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>성함 *</label>
          <input
            className={inputCls}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="홍길동"
            maxLength={30}
          />
        </div>
        <div>
          <label className={labelCls}>연락처 *</label>
          <input
            className={inputCls}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            maxLength={20}
          />
        </div>
      </div>

      {/* 수령 방법 */}
      <div>
        <label className={labelCls}>수령 방법 *</label>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { v: "pickup", t: "매장 픽업", d: "양재 화훼센타 12-15호" },
              { v: "delivery", t: "배송", d: "퀵/택배 (비용 별도 안내)" },
            ] as const
          ).map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => setReceiveType(o.v)}
              className={`rounded-2xl border p-4 text-left transition ${
                receiveType === o.v
                  ? "border-rose-deep bg-rose-light/60"
                  : "border-rose-light bg-white/60"
              }`}
            >
              <p className="text-sm font-medium text-ink">{o.t}</p>
              <p className="mt-1 text-xs text-ink-soft">{o.d}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 배송 주소 */}
      {receiveType === "delivery" && (
        <div>
          <label className={labelCls}>배송 주소 *</label>
          <input
            className={inputCls}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="받으실 주소를 입력해 주세요"
            maxLength={120}
          />
        </div>
      )}

      {/* 희망 일시 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>
            희망 {receiveType === "pickup" ? "픽업" : "배송"} 날짜 *
          </label>
          <input
            className={inputCls}
            type="date"
            min={minDate}
            value={desiredDate}
            onChange={(e) => setDesiredDate(e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>희망 시간</label>
          <input
            className={inputCls}
            type="time"
            value={desiredTime}
            onChange={(e) => setDesiredTime(e.target.value)}
          />
        </div>
      </div>

      {/* 카드 문구 */}
      <div>
        <label className={labelCls}>카드 문구 (선택)</label>
        <input
          className={inputCls}
          value={cardMessage}
          onChange={(e) => setCardMessage(e.target.value)}
          placeholder="예: 생일 축하해, 늘 고마워 💐"
          maxLength={100}
        />
      </div>

      {/* 요청사항 */}
      <div>
        <label className={labelCls}>요청사항 (선택)</label>
        <textarea
          className={`${inputCls} min-h-[80px] resize-y`}
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          placeholder="원하시는 색감, 분위기, 용도 등을 알려주세요"
          maxLength={500}
        />
      </div>

      {error && (
        <p className="rounded-2xl bg-rose-light/60 px-4 py-3 text-sm text-rose-deep">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full py-4 text-base disabled:opacity-60"
        style={{ touchAction: "manipulation" }}
      >
        {submitting ? "접수 중..." : `${formatPrice(total)} 주문 접수하기`}
      </button>
      <p className="text-center text-xs leading-relaxed text-ink-soft">
        주문 접수 후 입금 계좌를 안내해 드려요. 입금 확인 후 제작이 시작됩니다.
      </p>
    </form>
  );
}
