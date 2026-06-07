# 🚀 배포 가이드 (휴대폰만으로 가능)

온실 홈페이지를 인터넷에 띄워서 **휴대폰에서 바로 여는 주소**를 만드는 방법입니다.
PC 없이 휴대폰 브라우저만으로 할 수 있어요. 순서대로 따라 하세요.

준비물: GitHub 계정(이미 있음), 약 15분.

---

## 1단계 · 무료 데이터베이스 만들기 (Neon)

1. 휴대폰 브라우저로 **https://neon.tech** 접속 → **Sign up** → *Continue with GitHub* (제일 간편)
2. **Create project** (또는 New Project)
   - Project name: `onsil` (아무거나)
   - Region: **Singapore** 또는 **Tokyo** (한국에서 가까움)
3. 만들어지면 **Connection string**(연결 문자열)이 보입니다.
   - `Pooled connection` 토글은 **끄고(OFF)** 나오는 주소를 복사하세요.
   - `postgresql://...neon.tech/...?sslmode=require` 형태입니다.
   - ✅ 이 주소를 메모장 등에 잠깐 보관 (2단계에서 사용)

---

## 2단계 · Vercel에 배포하기

1. 휴대폰 브라우저로 **https://vercel.com** 접속 → **Sign Up** → *Continue with GitHub*
2. **Add New… → Project**
3. 저장소 목록에서 **`cheojang/flower`** 옆 **Import** 선택
   - (목록에 없으면 *Adjust GitHub App Permissions* 에서 flower 저장소 접근 허용)
4. **Environment Variables**(환경 변수) 펼치고 아래 값들을 추가:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | 1단계에서 복사한 Neon 연결 문자열 |
   | `AUTH_SECRET` | 아무 긴 무작위 문자열 (예: `onsil-secret-9f8a7b6c5d4e3f2a1b`) |
   | `NEXTAUTH_SECRET` | 위와 **같은 값** |
   | `ADMIN_PASSWORD` | 원하는 관리자 비밀번호 |

5. **Deploy** 버튼 클릭 → 1~2분 기다리면 완료 🎉
6. 완료 화면의 주소(예: `https://flower-xxxx.vercel.app`)를 누르면 **휴대폰에서 바로 열립니다.**
   - 관리자: 그 주소 뒤에 `/admin` → 위에서 정한 `ADMIN_PASSWORD`로 로그인

> ⚠️ 만약 첫 배포가 비어 보이면(README만): Vercel 프로젝트 → **Settings → Git →
> Production Branch** 를 `claude/flower-shop-website-9mYKj` 로 바꾸고 저장 →
> **Deployments → Redeploy**. (또는 이 브랜치를 `main`에 합치면 이 단계가 필요 없어요.)

---

## 3단계 (선택) · 카카오 로그인 켜기

1. https://developers.kakao.com → 앱 생성 → 카카오 로그인 활성화
2. **Redirect URI** 에 배포 주소 추가: `https://내주소.vercel.app/api/auth/callback/kakao`
3. Vercel → Settings → Environment Variables 에 추가 후 재배포:
   - `KAKAO_CLIENT_ID` = REST API 키
   - `KAKAO_CLIENT_SECRET` = 보안 > Client Secret
   - `AUTH_URL` = `https://내주소.vercel.app`

네이버·구글도 동일하게 `NAVER_*`, `GOOGLE_*` 키를 넣으면 자동으로 켜집니다.

---

## 자주 묻는 질문

- **사진 업로드가 안 돼요** → Vercel(서버리스)은 파일 저장이 안 됩니다. 관리자 편집에서
  **이미지 주소(URL) 붙여넣기**를 사용하세요. (인스타·구글포토 등의 이미지 주소)
- **상품을 바꿨는데 안 보여요** → 잠시 후 새로고침. 데이터는 Neon에 안전하게 저장됩니다.
- **다시 배포해도 내 상품이 지워지지 않나요?** → 네, 안전합니다. 시드는 처음 한 번만
  실행되고 이후 배포에서는 기존 데이터를 건드리지 않습니다.
