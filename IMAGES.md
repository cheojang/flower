# 🌷 AI 이미지 생성 가이드 (Google Vertex AI Imagen)

placeholder로 들어가 있는 꽃 이미지·상품 이미지를 **고화질 AI 사진**으로 한 번에 바꾸는 방법이에요.
구글 클라우드 Vertex AI의 Imagen 모델을 사용합니다.

> 이 스크립트를 **실행하기 전까지는** 기존 SVG 이미지가 그대로 쓰여서 사이트가 깨지지 않아요.
> 실행에 성공하면 생성된 `.jpg` 와 코드 참조가 함께 바뀝니다.

## 무엇이 생성되나요 (총 19장)

- **상품 사진 8종** — 꽃다발 · 미니부케 · 꽃바구니(2) · 화분 · 테라리움 · 개업화환 · 근조(장례) 화환.
  실제 한국 온라인 꽃집 상품 사진 톤을 참고하며, **글자·리본 문구·로고가 전혀 없는 순수 상품 사진**으로만 생성돼요
  (화환의 글자 리본도 빈 리본으로 처리).
- **랜딩·기타 페이지용 실사 꽃 사진 11장** — 히어로 배너, 클래스/소개/구독 배너, 갤러리 8장.
  랜딩과 여러 페이지 곳곳에 들어가는 고화질 실사 꽃 사진들이에요.

---

## 1. 구글 클라우드 준비 (최초 1회)

1. [console.cloud.google.com](https://console.cloud.google.com) 접속 → **프로젝트 생성** (이미 있으면 그대로)
2. 좌측 검색에서 **Vertex AI API** 검색 → **사용 설정(Enable)**
3. 프로젝트에 **결제 계정 연결** (Imagen은 유료 — 이미지 1장당 약 $0.02~0.04, 19장이면 1달러 미만)
4. **서비스 계정 키** 발급:
   - **IAM 및 관리자 → 서비스 계정 → 서비스 계정 만들기**
   - 역할: **Vertex AI 사용자(Vertex AI User)** 부여
   - 만든 계정 → **키 → 키 추가 → JSON** → 파일 다운로드 (예: `vertex-key.json`)

## 2. 환경변수 설정

터미널에서 (다운로드한 키 경로·프로젝트ID로 교체):

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/경로/vertex-key.json"
export GCP_PROJECT_ID="여기에-프로젝트-ID"
export GCP_LOCATION="us-central1"            # (선택, 기본값)
# export IMAGEN_MODEL="imagen-3.0-generate-002"  # (선택) 모델 변경 시
```

## 3. 실행

```bash
# 먼저 무엇이 만들어질지 미리보기 (호출 없음·무료)
npm run gen:images -- --dry

# 실제 생성 (전체 19장)
npm run gen:images

# 일부만:
npm run gen:images -- --only=product   # 상품 이미지만
npm run gen:images -- --only=brand     # 히어로·배너·갤러리만
```

실행이 끝나면:
- `public/img/*.jpg` 고화질 이미지 저장
- 코드의 `.svg` 참조 → `.jpg` 자동 교체 (히어로·배너·갤러리)
- 상품은 `prisma/seed.ts` 갱신 + (`DATABASE_URL` 있을 때) DB 상품 이미지도 갱신

## 4. 반영(배포)

```bash
git add -A
git commit -m "AI 생성 이미지 적용"
git push
```

> **상품 이미지가 안 바뀌어 보이면?** 운영 DB에는 기존 경로가 저장돼 있을 수 있어요.
> 배포 환경의 `DATABASE_URL` 을 export 한 상태로 `npm run gen:images -- --only=product` 를
> 다시 돌리거나, 관리자(`/admin`)에서 상품별로 이미지 주소를 `/img/product-N.jpg` 로 바꾸면 됩니다.

---

## 프롬프트 수정

생성되는 이미지의 분위기/구도를 바꾸고 싶으면 `scripts/generate-images.ts` 상단의
`STYLE` 문구와 각 항목의 `prompt` 를 수정하세요. 한 장만 다시 만들고 싶으면 해당 항목만
남기고 `--only` 로 돌리거나, 잠시 다른 항목을 주석 처리하면 됩니다.

## 비용·주의

- Imagen은 **유료 API**예요. 한 번 전체 생성(19장)은 보통 **1달러 미만**입니다.
- 사람 얼굴은 최소화(`personGeneration: dont_allow`)하도록 설정돼 꽃 위주로 나옵니다.
- 결과가 마음에 안 들면 프롬프트를 다듬어 재생성하면 돼요(생성할 때마다 과금되니 `--dry`로 먼저 확인).
