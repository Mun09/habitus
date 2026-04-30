# 이미지 에셋 가이드

실제 사진을 받으면 아래 폴더에 같은 키 이름으로 넣어주세요.
경로는 `src/lib/mock/images.ts` 한 곳에서만 관리합니다.

```
public/images/
├── logos/                       로고 (워드마크 SVG, 앱 아이콘)
│
├── hero/
│   ├── landing.jpg              랜딩 메인 (와이드, 따뜻한 거실/주방)
│   ├── design.jpg               디자인 페이지 hero
│   ├── matching.jpg             매칭 페이지 hero
│   ├── aftercare.jpg            사후관리 hero
│   └── trust.jpg                신뢰 페이지 hero
│
├── moodboard/                   AI 디자인 결과 무드보드 (각 4–6장)
│   ├── midcentury/{1..6}.jpg
│   ├── minimalist/{1..4}.jpg
│   ├── industrial/{1..4}.jpg
│   └── scandinavian/{1..4}.jpg
│
├── contractors/
│   ├── profiles/{1..8}.jpg      시공자 프로필 (정사각, 8명)
│   ├── portfolios/{1..8}/{1..6}.jpg   시공자별 포트폴리오 (~40장)
│   └── licenses/{1..5}.jpg      면허·사업자등록증
│
├── projects/
│   ├── updates/{1..8}.jpg       단계별 현장 사진 (철거/배관/전기/목공/도장/마감)
│   └── completed/{1..6}.jpg     완료 갤러리
│
├── reviewers/{1..6}.jpg         리뷰어 아바타
└── testimonials/{1..3}.jpg      랜딩 후기 인물 사진
```

## 적용 방법

`src/lib/mock/images.ts` 안에 두 가지 helper가 있습니다.

```ts
const u = (id: string, w = 1200) =>           // unsplash placeholder
  `https://images.unsplash.com/photo-${id}?...`;

const local = (path: string) =>               // public/images/* 경로
  `/images/${path}`;
```

placeholder를 실사진으로 바꾸려면 해당 줄만 교체하면 됩니다. 예:

```diff
- landing: u("1616486338812-3dadae4b4ace"),
+ landing: local("hero/landing.jpg"),
```

권장 포맷: JPG 또는 WebP, 가로 1200–1800px (hero는 2000+), 600KB 이하.
