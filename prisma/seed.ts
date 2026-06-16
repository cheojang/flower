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
    imageUrl: "/img/product-1.jpg",
    badge: "BEST",
    isFeatured: true,
    order: 1,
    slug: "bouquet",
  },
  {
    name: "오후 세시 미니 부케",
    description: "데일리로 부담 없이 선물하기 좋은 아담한 사이즈의 부케입니다.",
    price: 32000,
    imageUrl: "/img/product-2.jpg",
    badge: "신상",
    isFeatured: true,
    order: 2,
    slug: "bouquet",
  },
  {
    name: "포근한 계절 꽃바구니",
    description: "테이블 위 작은 정원처럼, 풍성하게 담아낸 시즌 꽃바구니예요.",
    price: 68000,
    imageUrl: "/img/product-3.jpg",
    isFeatured: true,
    order: 3,
    slug: "basket",
  },
  {
    name: "감사의 마음 꽃바구니",
    description: "감사와 축하의 자리를 환하게 밝혀줄 화사한 꽃바구니입니다.",
    price: 75000,
    imageUrl: "/img/product-4.jpg",
    order: 4,
    slug: "basket",
  },
  {
    name: "초록을 들이다 · 테이블 화분",
    description: "공간에 싱그러움을 더해주는 실내용 반려식물 화분이에요.",
    price: 42000,
    imageUrl: "/img/product-5.jpg",
    badge: "인기",
    order: 5,
    slug: "plant",
  },
  {
    name: "축하합니다 · 개업 축하화환",
    description: "새로운 시작을 응원하는 마음을 담은 3단 개업 축하화환입니다.",
    price: 120000,
    imageUrl: "/img/product-6.jpg",
    order: 6,
    slug: "congrats",
  },
  {
    name: "근조화환 · 마음을 전하다",
    description: "삼가 고인의 명복을 비는 정중한 근조화환입니다.",
    price: 110000,
    imageUrl: "/img/product-7.jpg",
    order: 7,
    slug: "wreath",
  },
  {
    name: "감성 테라리움 · 미니 정원",
    description: "유리 용기 안에 이끼와 소품으로 꾸민 작은 정원이에요. 오래 곁에 두기 좋아요.",
    price: 38000,
    imageUrl: "/img/product-8.jpg",
    badge: "신상",
    isFeatured: true,
    order: 8,
    slug: "terrarium",
  },

  // ── 추가 상품 (카테고리별 +3, 예비 이미지 활용) ──────────────
  // 꽃다발
  {
    name: "수줍은 첫인사 꽃다발",
    description: "은은한 파스텔 톤으로 가볍게 마음을 전하는 데일리 꽃다발이에요.",
    price: 39000,
    imageUrl: "/img/spare/product-1-40.jpg",
    order: 9,
    slug: "bouquet",
  },
  {
    name: "노을빛 라넌큘러스 다발",
    description: "포근한 노을빛 라넌큘러스와 튤립을 넉넉히 엮은 시그니처 꽃다발입니다.",
    price: 58000,
    imageUrl: "/img/spare/product-1-41.jpg",
    badge: "BEST",
    isFeatured: true,
    order: 10,
    slug: "bouquet",
  },
  {
    name: "오늘의 미니 꽃다발",
    description: "부담 없이 건네기 좋은 아담한 사이즈의 데일리 미니 부케예요.",
    price: 29000,
    imageUrl: "/img/spare/product-2-43.jpg",
    order: 11,
    slug: "bouquet",
  },
  // 꽃바구니
  {
    name: "둥근 정원 꽃바구니",
    description: "동그랗게 모아 담아 더 사랑스러운 라운드형 꽃바구니입니다.",
    price: 66000,
    imageUrl: "/img/spare/product-3-30.jpg",
    isFeatured: true,
    order: 12,
    slug: "basket",
  },
  {
    name: "키 큰 가든 바구니",
    description: "높낮이를 살려 풍성하게 연출한 가든 스타일 꽃바구니예요.",
    price: 78000,
    imageUrl: "/img/spare/product-3-31.jpg",
    order: 13,
    slug: "basket",
  },
  {
    name: "손잡이 피크닉 꽃바구니",
    description: "손잡이가 있어 선물하기 좋은 아담한 피크닉 무드 꽃바구니입니다.",
    price: 62000,
    imageUrl: "/img/spare/product-3-35.jpg",
    badge: "신상",
    order: 14,
    slug: "basket",
  },
  // 화분
  {
    name: "싱그러운 테이블 그린",
    description: "공간에 생기를 더하는 실내용 테이블 화분이에요. 관리도 쉬워요.",
    price: 45000,
    imageUrl: "/img/spare/product-5-41.jpg",
    order: 15,
    slug: "plant",
  },
  {
    name: "데스크 미니 식물",
    description: "책상 한켠에 두기 좋은 아담한 사이즈의 반려식물 화분입니다.",
    price: 35000,
    imageUrl: "/img/spare/product-5-42.jpg",
    badge: "인기",
    order: 16,
    slug: "plant",
  },
  {
    name: "행잉 그린 포트",
    description: "늘어지는 잎이 매력적인, 공간을 살리는 그린 식물 화분이에요.",
    price: 52000,
    imageUrl: "/img/spare/product-5-2.jpg",
    order: 17,
    slug: "plant",
  },
  // 테라리움
  {
    name: "원통 글래스 테라리움",
    description: "맑은 원통 유리 안에 이끼와 초록 식물을 담은 미니 정원이에요.",
    price: 42000,
    imageUrl: "/img/spare/product-8-30.jpg",
    order: 18,
    slug: "terrarium",
  },
  {
    name: "육각 글래스 테라리움",
    description: "각진 육각 유리가 감각적인, 초록으로 채운 인테리어 테라리움입니다.",
    price: 49000,
    imageUrl: "/img/spare/product-8-33.jpg",
    badge: "신상",
    isFeatured: true,
    order: 19,
    slug: "terrarium",
  },
  {
    name: "큐브 글래스 테라리움",
    description: "정육면체 유리에 이끼와 고사리를 담아 단정하게 연출했어요.",
    price: 46000,
    imageUrl: "/img/spare/product-8-35.jpg",
    order: 20,
    slug: "terrarium",
  },
  // 개업화환
  {
    name: "축하 3단 꽃 스탠드",
    description: "새로운 시작을 환하게 밝혀줄 3단 축하 꽃 스탠드입니다.",
    price: 120000,
    imageUrl: "/img/spare/product-6-40.jpg",
    order: 21,
    slug: "congrats",
  },
  {
    name: "화사한 개업 축하 스탠드",
    description: "컬러풀한 생화로 풍성하게 제작한 개업·행사용 축하 화환이에요.",
    price: 135000,
    imageUrl: "/img/spare/product-6-41.jpg",
    badge: "인기",
    order: 22,
    slug: "congrats",
  },
  {
    name: "프리미엄 축하 화환",
    description: "고급스러운 볼륨감으로 자리를 빛내는 프리미엄 축하 화환입니다.",
    price: 160000,
    imageUrl: "/img/spare/product-6-42.jpg",
    order: 23,
    slug: "congrats",
  },
  // 결혼식·장례식 화환
  {
    name: "근조 백국 화환",
    description: "순백의 국화로 정중하게 제작한 근조화환이에요.",
    price: 110000,
    imageUrl: "/img/spare/product-7-41.jpg",
    order: 24,
    slug: "wreath",
  },
  {
    name: "정중한 추모 화환",
    description: "삼가 고인의 명복을 비는 마음을 담은 단정한 추모 화환입니다.",
    price: 125000,
    imageUrl: "/img/spare/product-7-42.jpg",
    order: 25,
    slug: "wreath",
  },
  {
    name: "헌화 스탠드 화환",
    description: "헌화용으로 단정하고 품격 있게 제작한 흰 꽃 스탠드 화환이에요.",
    price: 140000,
    imageUrl: "/img/spare/product-7-43.jpg",
    order: 26,
    slug: "wreath",
  },
];

async function main() {
  console.log("🌱 카테고리 동기화 중...");

  // 목록에 없는 카테고리(정기구독 등) 삭제 — 상품도 cascade 삭제됨
  const validSlugs = categories.map((c) => c.slug);
  await prisma.category.deleteMany({ where: { slug: { notIn: validSlugs } } });

  // 카테고리 upsert — 신규 추가 및 순서/이름 갱신
  const slugToId: Record<string, string> = {};
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, order: c.order },
      create: c,
    });
    slugToId[c.slug] = cat.id;
  }
  console.log(`✅ 카테고리 ${categories.length}개 동기화 완료`);

  // 상품을 이름 기준으로 생성/갱신 (idempotent)
  //  - 기존 상품: 이미지·가격·설명 등 최신화
  //  - 신규 상품(목록에 새로 추가된 것): 새로 생성
  //  - 관리자가 직접 추가한 상품(목록에 없는 것)은 건드리지 않음
  //  SEED_FORCE=1 이면 전체 삭제 후 재삽입.
  if (process.env.SEED_FORCE) {
    await prisma.product.deleteMany();
  }

  let created = 0;
  let updated = 0;
  for (const p of products) {
    const catId = slugToId[p.slug];
    if (!catId) continue;
    const data = {
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      badge: p.badge ?? null,
      isFeatured: p.isFeatured ?? false,
      order: p.order,
      categoryId: catId,
    };
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data });
      updated++;
    } else {
      await prisma.product.create({ data });
      created++;
    }
  }

  console.log(`✅ 상품 동기화 완료 — 신규 ${created}개 생성, ${updated}개 갱신 (총 ${products.length}개)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
