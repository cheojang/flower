import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isAdminAuthenticated } from "@/lib/admin-auth";

// 사진 업로드 → /public/uploads 에 저장하고 접근 URL 반환
// (로컬/일반 서버에서 동작. Vercel 등 서버리스에서는 URL 붙여넣기 방식을 사용하세요)
export async function POST(req: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  const blob = file as File;
  if (!blob.type.startsWith("image/")) {
    return NextResponse.json({ error: "이미지 파일만 업로드할 수 있습니다." }, { status: 400 });
  }
  if (blob.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "5MB 이하 이미지만 가능합니다." }, { status: 400 });
  }

  const bytes = Buffer.from(await blob.arrayBuffer());
  const ext = (blob.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");

  try {
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, fileName), bytes);
  } catch {
    // Vercel 등 서버리스: 파일시스템이 읽기 전용 → 업로드 불가
    return NextResponse.json(
      {
        error:
          "이 서버에서는 파일 업로드가 지원되지 않아요. 이미지 주소(URL)를 붙여넣어 주세요.",
      },
      { status: 501 }
    );
  }

  return NextResponse.json({ url: `/uploads/${fileName}` });
}
