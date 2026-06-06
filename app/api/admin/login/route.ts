import { NextResponse } from "next/server";
import { verifyPassword, setAdminCookie, clearAdminCookie } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!verifyPassword(password ?? "")) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }
  setAdminCookie();
  return NextResponse.json({ ok: true });
}

// 로그아웃
export async function DELETE() {
  clearAdminCookie();
  return NextResponse.json({ ok: true });
}
