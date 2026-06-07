import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 카테고리(메뉴) 기본값
const categories = [
  { name: "꽃다발", slug: "bouquet", order: 1 },
  { name: "꽃바구니", slug: "basket", order: 2 },
  { name: "화분", slug: "plant", order: 3 },
  { name: "테라리움", slug: "terrarium", order: 4 },
  { name: "개업화환", slug: "congrats", order: 5 },
  { name: "결혼식·장례식 화환", slug: "wreath", order: 6 },
];

// 샘플 상품 (이미지는 /public/img 의 로컬 파스텔 플레이스홀더 — 관리자에서 실제 사진 URL로 교체)
const products: Array<{
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  badge?: string;
  isFeatured?: boolean;
  order: number;
  slug: string; // category slug
}> = [
  {
    name: "봄날의 편지 꽃다발",
    description: "부드러운 파스텔 톤의 라넌큘러스와 튤립으로 엮은 시그니처 꽃다발이에요.",
    price: 55000,
    imageUrl: "/img/product-1.svg",
    badge: "BEST",
    isFeatured: true,
    order: 1,
    slug: "bouquet",
  },
  {
    name: "오후 세시 미니 부케",
    description: "데일리로 부담 없이 선물하기 좋은 아담한 사이즈의 부케입니다.",
    price: 32000,
    imageUrl: "/img/product-2.svg",
    badge: "신상",
    isFeatured: true,
    order: 2,
    slug: "bouquet",
  },
  {
    name: "포근한 계절 꽃바구니",
    description: "테이블 위 작은 정원처럼, 풍성하게 담아낸 시즌 꽃바구니예요.",
    price: 68000,
    imageUrl: "/img/product-3.svg",
    isFeatured: true,
    order: 3,
    slug: "basket",
  },
  {
    name: "감사의 마음 꽃바구니",
    description: "감사와 축하의 자리를 환하게 밝혀줄 화사한 꽃바구니입니다.",
    price: 75000,
    imageUrl: "/img/product-4.svg",
    order: 4,
    slug: "basket",
  },
  {
    name: "초록을 들이다 · 테이블 화분",
    description: "공간에 싱그러움을 더해주는 실내용 반려식물 화분이에요.",
    price: 42000,
    imageUrl: "/img/product-5.svg",
    badge: "인기",
    order: 5,
    slug: "plant",
  },
  {
    name: "축하합니다 · 개업 축하화환",
    description: "새로운 시작을 응원하는 마음을 담은 3단 개업 축하화환입니다.",
    price: 120000,
    imageUrl: "/img/product-6.svg",
    order: 6,
    slug: "congrats",
  },
  {
    name: "근조화환 · 마음을 전하다",
    description: "삼가 고인의 명복을 비는 정중한 근조화환입니다.",
    price: 110000,
    imageUrl: "/img/product-7.svg",
    order: 7,
    slug: "wreath",
  },
  {
    name: "감성 테라리움 · 미니 정원",
    description: "유리 용기 안에 이끼와 소품으로 꾸민 작은 정원이에요. 오래 곁에 두기 좋아요.",
    price: 38000,
    imageUrl: "/img/product-8.svg",
    badge: "신상",
    isFeatured: true,
    order: 8,
    slug: "terrarium",
  },
];

async function main() {
  // 이미 데이터가 있으면 건너뜀 (재배포 시 관리자가 수정한 내용 보호)
  // 강제로 다시 채우려면 SEED_FORCE=1 환경변수와 함께 실행하세요.
  const existing = await prisma.category.count();
  if (existing > 0 && !process.env.SEED_FORCE) {
    console.log(`ℹ️ 이미 카테고리 ${existing}개가 있어 시드를 건너뜁니다.`);
    return;
  }

  console.log("🌱 시드 시작...");

  // 카테고리 upsert
  const slugToId: Record<string, string> = {};
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, order: c.order },
      create: c,
    });
    slugToId[c.slug] = cat.id;
  }

  // 기존 상품 비우고 다시 생성 (시드 반복 안전)
  await prisma.product.deleteMany();
  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        badge: p.badge,
        isFeatured: p.isFeatured ?? false,
        order: p.order,
        categoryId: slugToId[p.slug],
      },
    });
  }

  console.log(`✅ 카테고리 ${categories.length}개, 상품 ${products.length}개 생성 완료`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
