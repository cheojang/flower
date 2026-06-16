# 예비(스페어) 이미지 모음

AI로 생성해 둔 **예비용 고화질 이미지**예요. 현재 사이트에 쓰이는 대표 이미지 말고,
나중에 바꾸고 싶을 때 골라 쓸 수 있는 후보들입니다. (모두 텍스트 없음·2K)

## 파일 이름 규칙
- 상품: `product-<번호>-<후보>.jpg` (예: `product-3-6.jpg` = 꽃바구니 6번 후보)
  - 1 꽃다발 · 2 미니부케 · 3 꽃바구니 · 4 감사바구니 · 5 화분 · 6 개업화환 · 7 근조화환 · 8 테라리움
- 홈페이지 장식: `hero-*`, `banner-sub-*`, `banner-about-*`, `gallery-<번호>-*.jpg`

## 바꾸는 법 (대표 이미지 교체)
원하는 예비를 대표 파일 위치로 복사하고 커밋하면 끝이에요. 예) 꽃바구니를 6번 후보로 교체:

```bash
cp public/img/spare/product-3-6.jpg public/img/product-3.jpg
git add public/img/product-3.jpg && git commit -m "꽃바구니 이미지 교체" && git push
```

갤러리도 동일해요: `cp public/img/spare/gallery-5-2.jpg public/img/gallery-5.jpg`

> 더 필요하면 `npm run gen:images -- --only=product --count=5 --start=20` 처럼 추가 생성할 수 있어요
> (자세한 사용법은 루트의 `IMAGES.md` 참고).
