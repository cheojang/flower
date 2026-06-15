/**
 * AI 이미지 일괄 생성 스크립트 — Google Vertex AI Imagen
 * ---------------------------------------------------------------
 * 브랜드 이미지(히어로·배너·갤러리)와 상품 이미지(8종)의 placeholder SVG를
 * 고화질 AI 사진(JPG)으로 한 번에 생성합니다.
 *
 * 사용법:
 *   1) GCP 프로젝트에서 Vertex AI API 활성화 + 결제 연결
 *   2) 서비스 계정 키(JSON) 발급 → 파일 경로를 환경변수로 지정
 *   3) 아래 환경변수 설정 후 실행:
 *
 *      export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
 *      export GCP_PROJECT_ID=your-project-id
 *      export GCP_LOCATION=us-central1            # (선택, 기본값)
 *      export IMAGEN_MODEL=imagen-3.0-generate-002 # (선택)
 *      npm run gen:images
 *
 * 옵션:
 *   --only=brand|product   특정 묶음만 생성
 *   --dry                  실제 호출 없이 어떤 이미지를 만들지 출력만
 *   --no-apply             생성만 하고 코드/DB 참조는 바꾸지 않음
 *
 * 생성에 성공하면:
 *   - public/img/*.jpg 저장
 *   - 코드 내 .svg 참조를 .jpg 로 자동 교체 (브랜드 이미지)
 *   - DB 상품 imageUrl 을 .jpg 로 갱신 (DATABASE_URL 있을 때) + seed.ts 갱신
 *
 * 따라서 이 스크립트를 실행하기 전까지는 기존 SVG가 그대로 쓰여 사이트가 깨지지 않습니다.
 */

import { GoogleAuth } from "google-auth-library";
import { writeFile, readFile, access } from "fs/promises";
import path from "path";

type Spec = {
  /** public/img 안에 저장될 파일명(확장자 제외) */
  file: string;
  prompt: string;
  aspectRatio: "1:1" | "3:4" | "4:3" | "16:9" | "9:16";
  kind: "brand" | "product";
};

// 실제 한국 온라인 꽃집의 상품 사진 톤을 참고하되, 어떤 글자도 들어가지 않게 강하게 명시.
const STYLE =
  "professional product photography in the style of a Korean online flower shop listing, " +
  "natural soft daylight, shallow depth of field, fresh real flowers, elegant pastel and cream tones, " +
  "clean minimal studio background, high resolution, photorealistic. " +
  "ABSOLUTELY NO text, no letters, no Korean characters, no calligraphy, no printed ribbons or banners with writing, " +
  "no signage, no labels, no watermark, no logo. Plain unmarked ribbons only.";

const SPECS: Spec[] = [
  // ── 브랜드 이미지 ──────────────────────────────
  {
    file: "hero",
    aspectRatio: "16:9",
    kind: "brand",
    prompt:
      "Wide hero banner of a cozy Korean flower shop interior at Yangjae flower market, " +
      "abundant fresh pastel bouquets in buckets, morning light through the window, dreamy and warm. " +
      STYLE,
  },
  {
    file: "banner-sub",
    aspectRatio: "4:3",
    kind: "brand",
    prompt:
      "A florist's hands arranging a pastel bouquet on a wooden table in a bright flower workshop, " +
      "one-day flower class mood, calm and inviting. " +
      STYLE,
  },
  {
    file: "banner-about",
    aspectRatio: "4:3",
    kind: "brand",
    prompt:
      "An atmospheric still life of a small home garden corner with potted plants and a fresh bouquet, " +
      "soft natural light, warm storytelling brand mood. " +
      STYLE,
  },
  {
    file: "gallery-1",
    aspectRatio: "1:1",
    kind: "brand",
    prompt: "Top view of a soft pastel ranunculus and tulip bouquet on linen. " + STYLE,
  },
  {
    file: "gallery-2",
    aspectRatio: "1:1",
    kind: "brand",
    prompt: "A delicate white and blush rose bouquet wrapped in kraft paper. " + STYLE,
  },
  {
    file: "gallery-3",
    aspectRatio: "1:1",
    kind: "brand",
    prompt: "A lush seasonal flower basket overflowing with garden flowers on a table. " + STYLE,
  },
  {
    file: "gallery-4",
    aspectRatio: "1:1",
    kind: "brand",
    prompt: "Close-up of dewy peonies in pale pink, macro floral detail. " + STYLE,
  },
  {
    file: "gallery-5",
    aspectRatio: "1:1",
    kind: "brand",
    prompt: "A modern minimalist dried-flower arrangement in a ceramic vase. " + STYLE,
  },
  {
    file: "gallery-6",
    aspectRatio: "1:1",
    kind: "brand",
    prompt: "A small green indoor plant in a terracotta pot by a sunny window. " + STYLE,
  },
  {
    file: "gallery-7",
    aspectRatio: "1:1",
    kind: "brand",
    prompt: "A florist tying a ribbon on a fresh bouquet, hands in frame, workshop scene. " + STYLE,
  },
  {
    file: "gallery-8",
    aspectRatio: "1:1",
    kind: "brand",
    prompt: "A glass terrarium miniature garden with moss and tiny plants. " + STYLE,
  },
  // ── 상품 이미지 (seed.ts 순서와 1:1 대응) ──────────
  {
    file: "product-1",
    aspectRatio: "1:1",
    kind: "product",
    prompt: "A signature spring bouquet of pastel ranunculus and tulips, soft and romantic. " + STYLE,
  },
  {
    file: "product-2",
    aspectRatio: "1:1",
    kind: "product",
    prompt: "A small daily mini bouquet, dainty and casual, easy gift size. " + STYLE,
  },
  {
    file: "product-3",
    aspectRatio: "1:1",
    kind: "product",
    prompt: "A cozy seasonal flower basket, abundant like a little tabletop garden. " + STYLE,
  },
  {
    file: "product-4",
    aspectRatio: "1:1",
    kind: "product",
    prompt: "A bright cheerful thank-you flower basket, warm and celebratory. " + STYLE,
  },
  {
    file: "product-5",
    aspectRatio: "1:1",
    kind: "product",
    prompt: "A fresh green indoor companion plant in a stylish table pot. " + STYLE,
  },
  {
    file: "product-6",
    aspectRatio: "3:4",
    kind: "product",
    prompt:
      "A tall three-tier Korean congratulatory opening flower wreath stand fully covered with bright colorful fresh flowers, " +
      "with plain blank white sash ribbons that have absolutely no writing on them, studio product shot on a clean white background. " +
      STYLE,
  },
  {
    file: "product-7",
    aspectRatio: "3:4",
    kind: "product",
    prompt:
      "A solemn dignified white Korean funeral condolence flower wreath stand made of white chrysanthemums, " +
      "with plain blank white sash ribbons that have absolutely no writing on them, studio product shot on a clean white background. " +
      STYLE,
  },
  {
    file: "product-8",
    aspectRatio: "1:1",
    kind: "product",
    prompt: "An aesthetic glass terrarium miniature garden with moss and small props. " + STYLE,
  },
];

// 브랜드 이미지가 하드코딩으로 참조된 파일들 (.svg → .jpg 교체 대상)
const BRAND_REF_FILES = [
  "components/Hero.tsx",
  "app/page.tsx",
  "app/about/page.tsx",
  "app/subscription/page.tsx",
  "app/class/page.tsx",
  "components/InstaGallery.tsx",
];

const PROJECT = process.env.GCP_PROJECT_ID;
const LOCATION = process.env.GCP_LOCATION || "us-central1";
const MODEL = process.env.IMAGEN_MODEL || "imagen-3.0-generate-002";
const IMG_DIR = path.join(process.cwd(), "public", "img");

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const NO_APPLY = args.includes("--no-apply");
const onlyArg = args.find((a) => a.startsWith("--only="))?.split("=")[1] as
  | "brand"
  | "product"
  | undefined;

async function getAccessToken(): Promise<string> {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token.token) throw new Error("액세스 토큰 발급 실패");
  return token.token;
}

async function generateOne(spec: Spec, token: string): Promise<Buffer> {
  const url =
    `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT}` +
    `/locations/${LOCATION}/publishers/google/models/${MODEL}:predict`;

  const body = {
    instances: [{ prompt: spec.prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: spec.aspectRatio,
      outputOptions: { mimeType: "image/jpeg", compressionQuality: 82 },
      // 사람 얼굴 생성 최소화 (꽃 위주)
      personGeneration: "dont_allow",
      addWatermark: false,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Imagen 호출 실패 (${res.status}): ${text.slice(0, 500)}`);
  }

  const json = (await res.json()) as {
    predictions?: { bytesBase64Encoded?: string }[];
  };
  const b64 = json.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error("응답에 이미지 데이터가 없습니다: " + JSON.stringify(json).slice(0, 300));
  return Buffer.from(b64, "base64");
}

async function patchBrandRefs(generated: Set<string>) {
  for (const rel of BRAND_REF_FILES) {
    const fp = path.join(process.cwd(), rel);
    try {
      await access(fp);
    } catch {
      continue;
    }
    let src = await readFile(fp, "utf8");
    let changed = false;
    for (const file of generated) {
      const from = `/img/${file}.svg`;
      const to = `/img/${file}.jpg`;
      if (src.includes(from)) {
        src = src.split(from).join(to);
        changed = true;
      }
    }
    if (changed) {
      await writeFile(fp, src);
      console.log(`  ↳ 참조 갱신: ${rel}`);
    }
  }
}

async function patchSeed(generated: Set<string>) {
  const fp = path.join(process.cwd(), "prisma", "seed.ts");
  try {
    let src = await readFile(fp, "utf8");
    let changed = false;
    for (const file of generated) {
      const from = `/img/${file}.svg`;
      const to = `/img/${file}.jpg`;
      if (src.includes(from)) {
        src = src.split(from).join(to);
        changed = true;
      }
    }
    if (changed) {
      await writeFile(fp, src);
      console.log("  ↳ 참조 갱신: prisma/seed.ts");
    }
  } catch {
    /* seed 없음 */
  }
}

async function patchDb(generated: Set<string>) {
  if (!process.env.DATABASE_URL) {
    console.log("  ⚠ DATABASE_URL 없음 → DB 상품 이미지 갱신은 건너뜀 (배포 후 재시드 또는 관리자에서 교체)");
    return;
  }
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    for (const file of generated) {
      await prisma.product.updateMany({
        where: { imageUrl: `/img/${file}.svg` },
        data: { imageUrl: `/img/${file}.jpg` },
      });
    }
    await prisma.$disconnect();
    console.log("  ↳ DB 상품 imageUrl 갱신 완료");
  } catch (e) {
    console.log("  ⚠ DB 갱신 실패(무시 가능):", (e as Error).message);
  }
}

async function main() {
  const specs = SPECS.filter((s) => !onlyArg || s.kind === onlyArg);

  console.log(`\n🌷 AI 이미지 생성 — 모델 ${MODEL} / ${LOCATION}`);
  console.log(`   대상 ${specs.length}장 (${DRY ? "DRY RUN" : "실제 생성"})\n`);

  if (DRY) {
    for (const s of specs) console.log(`  • ${s.kind.padEnd(7)} ${s.file}.jpg  [${s.aspectRatio}]`);
    console.log("\n(--dry: 실제 호출 없이 종료)");
    return;
  }

  if (!PROJECT) {
    console.error("❌ GCP_PROJECT_ID 환경변수가 필요합니다.");
    process.exit(1);
  }

  const token = await getAccessToken();
  const generated = new Set<string>();

  for (const spec of specs) {
    process.stdout.write(`  • ${spec.file}.jpg … `);
    try {
      const buf = await generateOne(spec, token);
      await writeFile(path.join(IMG_DIR, `${spec.file}.jpg`), buf);
      generated.add(spec.file);
      console.log(`✓ (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.log("✗");
      console.error("     " + (e as Error).message);
    }
  }

  console.log(`\n생성 완료: ${generated.size}/${specs.length}`);

  if (generated.size > 0 && !NO_APPLY) {
    console.log("\n참조 교체 중…");
    const brandGenerated = new Set(
      SPECS.filter((s) => s.kind === "brand" && generated.has(s.file)).map((s) => s.file)
    );
    const productGenerated = new Set(
      SPECS.filter((s) => s.kind === "product" && generated.has(s.file)).map((s) => s.file)
    );
    if (brandGenerated.size) await patchBrandRefs(brandGenerated);
    if (productGenerated.size) {
      await patchSeed(productGenerated);
      await patchDb(productGenerated);
    }
    console.log("\n✅ 끝. 변경된 이미지/코드를 커밋·배포하세요:");
    console.log("   git add public/img && git add -A && git commit -m 'AI 생성 이미지 적용' && git push");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
