import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const VALID_STATUS = ["NEW", "CONFIRMED", "COMPLETED", "CANCELED"];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const { status } = await req.json();
  if (!VALID_STATUS.includes(status)) {
    return NextResponse.json({ error: "올바르지 않은 상태입니다." }, { status: 400 });
  }
  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status },
  });
  return NextResponse.json(order);
}
