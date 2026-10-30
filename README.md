# 무드 다이어리 (Mood Diary)

> A color-based mood diary PWA — pick today's mood, write a note, attach photos, and look back on a calendar. All data stays in your browser.

**색으로 기록하는 나의 하루.** 오늘의 기분을 고르고, 짧은 글과 사진을 남기고, 월간·연간 달력에서 기분의 흐름을 돌아보는 모바일용 일기 웹앱입니다. 서버 없이 브라우저(IndexedDB)에만 저장됩니다.

## 주요 기능

- **기분 선택** — 행복해요 · 평온해요 · 걱정돼요 · 슬퍼요 · 화나요, 다섯 가지 기분 중 하나를 고릅니다. 기분을 고르면 작성 폼이 나타납니다.
- **일기 작성** — 하루에 한 개의 기록(기분 + 글 + 사진)을 저장합니다. 같은 날짜에 다시 저장하면 기존 기록을 수정합니다.
- **사진 첨부** — 사진을 Data URL로 변환해 기록과 함께 저장합니다.
- **달력 보기** (`/calendar`) — 월간 / 연간 달력에서 날짜별 기분을 확인하고, 날짜를 누르면 그 날의 기록으로 이동합니다.
- **기록 상세** (`/entry/[date]`) — 특정 날짜의 기록을 보고 수정하거나 삭제합니다.
- **오프라인 · PWA** — `@ducanh2912/next-pwa`로 서비스 워커를 생성하고, 웹 앱 매니페스트로 홈 화면에 설치할 수 있습니다 (개발 모드에서는 비활성화).

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router), React 19, TypeScript |
| 스타일 · 애니메이션 | Tailwind CSS 4, Framer Motion, lucide-react 아이콘 |
| 상태 관리 | Zustand |
| 로컬 저장소 | Dexie (IndexedDB), dexie-react-hooks |
| 날짜 처리 | date-fns |
| PWA | @ducanh2912/next-pwa (Workbox) |

## 실행 방법

필요한 것: Node.js 20+

```bash
npm install
npm run dev      # http://localhost:3000
```

프로덕션 빌드 (PWA 서비스 워커 포함):

```bash
npm run build
npm start
```

> `dev` / `build` 스크립트는 `--webpack` 옵션으로 실행됩니다 (next-pwa 호환).

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 오늘 기록: 날짜 · 기분 선택 · 작성 폼
│   ├── calendar/page.tsx     # 월간 / 연간 달력
│   └── entry/[date]/page.tsx # 날짜별 기록 보기 · 수정 · 삭제
├── components/               # MoodSelector, DiaryForm, PhotoUpload, Monthly/YearlyCalendar, BackgroundAura …
├── lib/
│   ├── db.ts                 # Dexie DB (MoodDiaryDB.entries) CRUD
│   ├── store.ts              # Zustand 전역 상태
│   └── constants.ts          # 기분 카테고리, 요일 · 월 라벨
└── types/index.ts            # DiaryEntry 타입
public/manifest.json          # PWA 매니페스트
```

## 데이터 저장

모든 기록은 브라우저의 IndexedDB(`MoodDiaryDB`)에 저장되며 외부 서버로 전송되지 않습니다. 브라우저 데이터를 지우면 기록도 함께 삭제됩니다.
