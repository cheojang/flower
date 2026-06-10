// Vercel 배포 빌드 전용 스크립트
// schema.prisma 의 datasource 를 SQLite → PostgreSQL(DATABASE_URL) 로 전환합니다.
// (로컬은 SQLite 그대로, 배포 환경에서만 이 스크립트가 실행됨)
const fs = require("fs");

const file = "prisma/schema.prisma";
let s = fs.readFileSync(file, "utf8");

// DIRECT_URL 이 설정된 환경(주로 Production)에서만 directUrl 을 추가합니다.
// 프리뷰 등 DIRECT_URL 이 없는 환경에서는 url 만 사용해 빌드가 깨지지 않게 합니다.
const hasDirect = !!process.env.DIRECT_URL;
const urlBlock = hasDirect
  ? 'url      = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")'
  : 'url      = env("DATABASE_URL")';

s = s
  .replace('provider = "sqlite"', 'provider = "postgresql"')
  .replace('url      = "file:./dev.db"', urlBlock);

fs.writeFileSync(file, s);
console.log(
  `✅ Prisma datasource → postgresql (${hasDirect ? "DATABASE_URL + DIRECT_URL" : "DATABASE_URL only"})`
);
