import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

/** 주문번호 생성: L + YYMMDD + - + 당일 순번 3자리 (예: L250612-003) */
async function generateOrderNo(): Promise<string> {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const prefix = `L${yy}${mm}${dd}`;

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayCount = await prisma.order.count({
    where: { createdAt: { gte: startOfDay } },
  });
  return `${prefix}-${String(todayCount + 1).padStart(3, "0")}`;
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    productId,
    quantity,
    customerName,
    phone,
    receiveType,
    desiredAt,
    address,
    cardMessage,
    request: requestNote,
  } = body;

  // 검증
  if (!productId || !customerName?.trim() || !phone?.trim() || !desiredAt) {
    return NextResponse.json(
      { error: "상품, 이름, 연락처, 희망 일시는 필수입니다." },
      { status: 400 }
    );
  }
  if (receiveType !== "pickup" && receiveType !== "delivery") {
    return NextResponse.json({ error: "수령 방법을 선택해 주세요." }, { status: 400 });
  }
  if (receiveType === "delivery" && !address?.trim()) {
    return NextResponse.json({ error: "배송 주소를 입력해 주세요." }, { status: 400 });
  }
  const qty = Math.max(1, Math.min(99, Number(quantity) || 1));
  const when = new Date(desiredAt);
  if (Number.isNaN(when.getTime())) {
    return NextResponse.json({ error: "희망 일시가 올바르지 않습니다." }, { status: 400 });
  }

  // 가격은 클라이언트 값을 믿지 않고 DB에서 스냅샷
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "상품을 찾을 수 없습니다." }, { status: 404 });
  }

  // 로그인 상태면 회원 연결 (비로그인 주문도 허용)
  const session = await auth().catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  // 주문번호 충돌(동시 주문) 시 최대 3회 재시도
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const order = await prisma.order.create({
        data: {
          orderNo: await generateOrderNo(),
          productName: product.name,
          price: product.price,
          quantity: qty,
          customerName: customerName.trim(),
          phone: phone.trim(),
          receiveType,
          desiredAt: when,
          address: address?.trim() ?? "",
          cardMessage: cardMessage?.trim() ?? "",
          request: requestNote?.trim() ?? "",
          userId,
        },
      });
      return NextResponse.json({ orderNo: order.orderNo }, { status: 201 });
    } catch (e: unknown) {
      const isUniqueConflict =
        typeof e === "object" && e !== null && (e as { code?: string }).code === "P2002";
      if (!isUniqueConflict || attempt === 2) throw e;
    }
  }
  return NextResponse.json({ error: "주문 처리에 실패했어요. 다시 시도해 주세요." }, { status: 500 });
}
