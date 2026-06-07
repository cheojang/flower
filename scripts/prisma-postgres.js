// Vercel 배포 빌드 전용 스크립트
// schema.prisma 의 datasource 를 SQLite → PostgreSQL(DATABASE_URL) 로 전환합니다.
// (로컬은 SQLite 그대로, 배포 환경에서만 이 스크립트가 실행됨)
const fs = require("fs");

const file = "prisma/schema.prisma";
let s = fs.readFileSync(file, "utf8");

s = s
  .replace('provider = "sqlite"', 'provider = "postgresql"')
  .replace('url      = "file:./dev.db"', "url      = env(\"DATABASE_URL\")");

fs.writeFileSync(file, s);
console.log("✅ Prisma datasource → postgresql (env DATABASE_URL)");
