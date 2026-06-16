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

// 실제 한국 온라인 꽃집의 상품 사진 톤을 참고하되, 어떤 글자/카드/라벨/사람도 들어가지 않게 강하게 명시.
const STYLE =
  "professional product photography in the style of a Korean online flower shop listing, " +
  "natural soft daylight, shallow depth of field, fresh real flowers, elegant pastel and cream tones, " +
  "clean minimal studio background, ultra high resolution, sharp focus, photorealistic. " +
  "ABSOLUTELY NO text of any kind, no letters, no words, no numbers, no Korean characters, no calligraphy, " +
  "no paper card, no message card, no greeting card, no note card, no label, no tag, no price tag, " +
  "no printed ribbon, no ribbon with writing, no signboard, no message board, no banner, no signage, " +
  "no watermark, no logo, and no people, no hands, no fingers.";

// 모든 상품 사진의 배경을 동일하게 통일 (색·패턴 일관) — 쇼핑몰 카드 톤 정렬용
const BACKGROUND =
  "Shot against one consistent identical background for all photos: a plain seamless soft warm ivory " +
  "studio backdrop (very light warm grey-cream, hex around #F3EFEA), smooth and uniform with no pattern, " +
  "even soft studio lighting, a subtle soft shadow under the subject, centered composition.";

// 텍스트/카드/사람 제거용 네거티브 프롬프트 (Imagen이 강하게 회피)
const NEGATIVE =
  "text, letters, words, numbers, typography, caption, handwriting, calligraphy, " +
  "card, paper card, message card, greeting card, note card, label, sticker, tag, price tag, " +
  "printed ribbon, ribbon with text, ribbon, sash, paper sash, fan-shaped sash, vertical banner, bow, ribbon bow, " +
  "sign, signboard, message board, banner, poster, watermark, logo, stamp, " +
  "collage, grid, multiple panels, split image, diptych, triptych, picture-in-picture, " +
  "dog, cat, animal, pet, portrait, face, " +
  "person, people, human, hand, hands, fingers, arm, blurry, low quality, distorted";

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
      "A bright flower workshop scene with pastel bouquets, ribbon spools, scissors and fresh flowers " +
      "arranged on a wooden table for a one-day flower class, no people. " +
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
    prompt: "A freshly wrapped pastel bouquet resting on a wooden workshop table, no people. " + STYLE,
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
    prompt:
      "A single full-frame studio product photograph of one spring bouquet of pastel ranunculus and tulips, " +
      "wrapped in plain unprinted matte paper in a soft solid color and tied simply, one bouquet centered in a single frame. " +
      STYLE,
  },
  {
    file: "product-2",
    aspectRatio: "1:1",
    kind: "product",
    prompt:
      "A small daily mini bouquet, dainty and casual, easy gift size, " +
      "wrapped in plain unprinted matte paper in a soft solid color. " +
      STYLE,
  },
  {
    file: "product-3",
    aspectRatio: "1:1",
    kind: "product",
    prompt:
      "A lush pastel flower arrangement overflowing from a plain woven wicker basket, like a little abundant tabletop garden. " +
      STYLE,
  },
  {
    file: "product-4",
    aspectRatio: "1:1",
    kind: "product",
    prompt:
      "A bright cheerful pastel flower arrangement in a plain woven basket, warm and celebratory, " +
      "with no ribbon, no bow, no card, no tag, no sign. " +
      STYLE,
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
      "A tall slender tiered flower tower arrangement for a grand opening celebration, several round tiers of colorful roses, lilies, " +
      "carnations and chrysanthemums with green fan-shaped leaves, mounted on a thin metal tripod stand, flowers only. " +
      "Studio product shot on a clean white background. " +
      STYLE,
  },
  {
    file: "product-7",
    aspectRatio: "3:4",
    kind: "product",
    prompt:
      "A solemn dignified round Korean funeral condolence flower wreath made only of white chrysanthemums and green leaves on a metal stand, " +
      "with absolutely no sash ribbons and no message board, studio product shot on a clean white background. " +
      STYLE,
  },
  {
    file: "product-8",
    aspectRatio: "1:1",
    kind: "product",
    prompt:
      "A close-up indoor studio product photograph of one small clear glass bell jar cloche standing on a plain surface, " +
      "with green moss, tiny ferns and small pebbles arranged inside the glass jar. " +
      "The single glass jar fills the frame, indoor product shot, no flowers, no people, no tree, no outdoor scene. " +
      STYLE,
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
const MODEL = process.env.IMAGEN_MODEL || "imagen-4.0-generate-001";
const IMAGE_SIZE = process.env.IMAGEN_SIZE || "2K"; // 1K | 2K (Imagen 생성 최대 2K=2048px)
const IMG_DIR = path.join(process.cwd(), "public", "img");

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const NO_APPLY = args.includes("--no-apply");
const SKIP_EXISTING = args.includes("--skip-existing");
// 요청 간격(ms) — Imagen 분당 quota 회피용. --delay=15000 처럼 조절 가능
const DELAY = Number(args.find((a) => a.startsWith("--delay="))?.split("=")[1] ?? 12000);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const onlyArg = args.find((a) => a.startsWith("--only="))?.split("=")[1] as
  | "brand"
  | "product"
  | undefined;
// 특정 파일명만 생성 (쉼표구분, 부분일치). 예: --match=product-1,product-7
const matchArg = args.find((a) => a.startsWith("--match="))?.split("=")[1];
const matchList = matchArg ? matchArg.split(",").map((s) => s.trim()).filter(Boolean) : null;

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

  // 상품 사진은 동일 배경(BACKGROUND) + 장식/글자 제거 문구를 덧붙여 톤 통일·텍스트 억제
  const CLEAN =
    "Presented cleanly with no ribbon, no bow, no sash, no card, no message card, no label, no tag, " +
    "and absolutely no text or letters anywhere in the image. Any wrapping paper must be plain and unprinted.";
  const promptText =
    spec.kind === "product" ? `${spec.prompt} ${CLEAN} ${BACKGROUND}` : spec.prompt;

  const body = {
    instances: [{ prompt: promptText }],
    parameters: {
      sampleCount: 1,
      aspectRatio: spec.aspectRatio,
      sampleImageSize: IMAGE_SIZE, // 2K = 2048px (최고 화질)
      negativePrompt: NEGATIVE, // 글자·카드·라벨·사람 강하게 배제
      outputOptions: { mimeType: "image/jpeg", compressionQuality: 88 },
      // dont_allow 는 꽃 사진도 과민 차단하는 경우가 있어 allow_adult 사용.
      // 사람/손 배제는 negativePrompt 로 처리.
      personGeneration: process.env.IMAGEN_PERSON || "allow_adult",
      addWatermark: false,
    },
  };

  // 429(quota)·5xx 는 지수 백오프로 재시도
  const backoffs = [20000, 40000, 80000, 120000];
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const json = (await res.json()) as {
        predictions?: { bytesBase64Encoded?: string }[];
      };
      const b64 = json.predictions?.[0]?.bytesBase64Encoded;
      if (!b64)
        throw new Error("응답에 이미지 데이터가 없습니다: " + JSON.stringify(json).slice(0, 300));
      return Buffer.from(b64, "base64");
    }

    const text = await res.text();
    const retryable = res.status === 429 || res.status >= 500;
    if (retryable && attempt < backoffs.length) {
      const wait = backoffs[attempt];
      process.stdout.write(`(quota, ${wait / 1000}s 대기 후 재시도) `);
      await sleep(wait);
      continue;
    }
    throw new Error(`Imagen 호출 실패 (${res.status}): ${text.slice(0, 300)}`);
  }
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
  const specs = SPECS.filter(
    (s) =>
      (!onlyArg || s.kind === onlyArg) &&
      (!matchList || matchList.some((m) => s.file.includes(m)))
  );

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

  for (let i = 0; i < specs.length; i++) {
    const spec = specs[i];
    const outPath = path.join(IMG_DIR, `${spec.file}.jpg`);

    // 이미 만든 건 건너뛰기 (재실행 시 중복 과금 방지)
    if (SKIP_EXISTING) {
      try {
        await access(outPath);
        generated.add(spec.file); // 참조 교체 대상에는 포함
        console.log(`  • ${spec.file}.jpg … (이미 있음, 건너뜀)`);
        continue;
      } catch {
        /* 없으면 생성 진행 */
      }
    }

    process.stdout.write(`  • ${spec.file}.jpg … `);
    try {
      const buf = await generateOne(spec, token);
      await writeFile(outPath, buf);
      generated.add(spec.file);
      console.log(`✓ (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.log("✗");
      console.error("     " + (e as Error).message);
    }

    // 다음 요청 전 간격 (quota 회피)
    if (i < specs.length - 1) await sleep(DELAY);
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
