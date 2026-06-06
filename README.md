# 🌷 온실 (ONSIL) — 감성 파스텔 꽃집 홈페이지

> "당신의 계절을 피우다"

파스텔 감성 + 인스타 무드의 꽃집 웹사이트입니다. 모바일 우선 반응형으로 제작되어
하나의 코드로 모바일과 PC를 동시에 관리합니다.

## ✨ 주요 기능

- **랜딩페이지** — 풀스크린 히어로, 추천 상품, 정기구독 티저, 브랜드 스토리, 인스타 감성 갤러리
- **상품(Shop)** — 카테고리 필터, 상품 상세, 관련 상품 추천
- **정기구독 / 플라워 클래스 / 브랜드 스토리 / 오시는 길** 페이지
- **카카오톡·네이버 톡톡·전화 상담** — 모든 페이지 우하단 플로팅 위젯 + 상담 페이지
- **소셜 로그인** — 카카오 로그인(지금) / 네이버·구글(키만 넣으면 자동 활성화)
- **관리자 페이지(`/admin`)** — 상품·가격, 카테고리(메뉴)를 손쉽게 추가/수정/삭제 (모바일에서도 OK)

## 🛠 기술 스택

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma + SQLite · NextAuth(Auth.js) v5

## 🚀 시작하기

```bash
# 1) 패키지 설치
npm install

# 2) 환경변수 준비
cp .env.example .env   # 그리고 값 채우기 (아래 설명 참고)

# 3) 데이터베이스 생성 + 샘플 데이터 시드
npx prisma db push
npm run seed

# 4) 개발 서버 실행
npm run dev            # http://localhost:3000
```

프로덕션 빌드: `npm run build && npm start`

## 🔐 관리자 페이지

- 주소: `/admin` (로그인: `/admin/login`)
- 비밀번호: `.env`의 `ADMIN_PASSWORD` (기본값 `onsil1234` — 운영 전 반드시 변경)
- 여기서 상품·가격·카테고리를 수정하면 사이트에 **즉시 반영**됩니다.

## 💬 상담 채널 연결 (카카오 / 네이버)

`lib/config.ts`의 `consult` 값을 실제 채널 주소로 바꾸면 됩니다. (현재는 플레이스홀더)

```ts
consult: {
  kakaoChannel: "https://pf.kakao.com/_채널ID/chat", // 카카오톡 채널 관리자센터
  naverTalk: "https://talk.naver.com/ct/숫자ID",      // 네이버 톡톡 파트너센터
  naverPlace: "https://map.naver.com/...",            // 스마트플레이스 업체 URL
}
```

전화번호·주소·영업시간·인스타 핸들도 같은 `lib/config.ts`에서 한 번에 관리합니다.

## 👤 소셜 로그인 설정

`.env`에 키를 넣으면 해당 로그인 버튼이 자동으로 켜집니다. (키가 없으면 "준비 중"으로 표시)

### 카카오 (지금 사용)
1. https://developers.kakao.com 에서 앱 생성
2. **카카오 로그인** 활성화 → Redirect URI에 `http://localhost:3000/api/auth/callback/kakao` 추가
   (배포 시 실제 도메인으로 교체)
3. `REST API 키` → `KAKAO_CLIENT_ID`, `보안 > Client Secret` → `KAKAO_CLIENT_SECRET`

### 네이버 / 구글 (나중에)
- 네이버: https://developers.naver.com — Callback `…/api/auth/callback/naver`
- 구글: https://console.cloud.google.com — Redirect `…/api/auth/callback/google`
- 각각 `.env`의 `NAVER_*`, `GOOGLE_*` 값을 채우면 즉시 활성화됩니다.

## 📁 구조

```
app/                # 페이지 + API 라우트 (App Router)
  admin/            # 관리자 (대시보드·상품·카테고리·로그인)
  api/admin/        # 상품·카테고리 CRUD, 관리자 로그인 API
  api/auth/         # NextAuth 소셜 로그인
components/         # 공통 UI (Header, Footer, FloatingConsult, ProductCard ...)
  admin/            # 관리자 전용 UI
lib/                # config(브랜드/상담), db(Prisma), 인증
prisma/             # schema + seed
```

## 📣 마케팅

마케팅 전략은 [`MARKETING.md`](./MARKETING.md)를 참고하세요.
