# NEO — 3단계 Claude Code 작업 계획서

확정된 6화면을 Next.js PWA로 구현하기 위한 작업 정의서. 이 문서를 Claude Code에 그대로 넘긴다.

## 0. 확정 사항

| 항목 | 값 |
|---|---|
| 스택 | Next.js (App Router) + TypeScript + Tailwind + shadcn |
| 데이터 | 정적 JSON + localStorage |
| 리포지토리 | 개인 GitHub 신규 private 리포 |
| 배포 | Vercel (연결됨) |
| 범위 | 6화면 + 빈/로딩/에러/오프라인 상태 |
| 범위 밖 | 온보딩, 로그인, 실제 법률 수집 파이프라인, 다국어 UI |

## 1. 디자인 검수 결과 — 6화면 전부 통과

| 검사 | 결과 |
|---|---|
| `box-shadow` | **0개** |
| `border-radius` | **4개뿐 — 전부 S3 체크박스(16×16 원형)**. 허용된 유일한 예외 |
| 이모지 | **0개** |
| 테두리 | 전부 `1px solid #2E2E2E` |
| 폰트 | Pretendard 단일 |
| 화면 제목 | 6개 전부 `700 24px/30px` — 32px Display 유출 없음 |
| 위험도 색 | 위험도 표현에만 사용, 링크·버튼에 유출 없음 |

**아트보드는 스크롤 화면의 첫 화면만 보여준다.** S2의 5번째 법률 행, S3의 AFFECTED·SOURCE 섹션, S4의 제품 리스트 하단은 HTML에는 있으나 844px 아래로 내려가 있다. 정상이다.

## 2. 중요한 발견 — 의존성 2개가 사라진다

Claude Design이 `neo-dots.js`(7.6KB)를 자체 생성했다. d3-geo + topojson 기반 **모노크롬 도트 매트릭스 지오그래피 렌더러**이고 모드가 두 개다.

- `mode="globe"` — 정사도법 지구본 → **S1**
- `mode="asia"` — 평면 메르카토르 → **S5**

즉 **S1 지구본과 S5 지도를 한 모듈이 이미 커버한다.** 컴포넌트 매핑에서 잡아뒀던 Magic UI `Globe`(cobe)와 Aceternity `World Map` **둘 다 필요 없다.** 디자인과 100% 일치하는 렌더러가 이미 있는데 다른 라이브러리를 넣으면 미묘하게 어긋난다.

**단, 그대로 쓰면 안 된다.** 현재 런타임에 CDN에서 세 가지를 받아온다:

```
unpkg.com/d3@7.9.0/dist/d3.min.js
unpkg.com/topojson-client@3.1.0/...
cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json
```

**오프라인 PWA에서 이건 치명적이다.** 포팅 시 반드시:

1. `d3-geo`와 `topojson-client`를 npm 의존성으로 설치 (d3 전체가 아니라 `d3-geo`만 — 약 30KB)
2. `countries-110m.json`을 `public/geo/`에 정적 파일로 내려받아 포함 (약 110KB)
3. `<canvas>` 렌더링 로직을 React 컴포넌트로 감싸 `useEffect` + `ref`로 처리

## 3. 라우트

| 경로 | 화면 | 탭바 | 비고 |
|---|---|---|---|
| `/` | S1 Home | ○ | |
| `/laws` | S2 Laws | ○ | |
| `/laws/[id]` | S3 Law Detail | ✕ | 하단 고정 CTA 바 |
| `/company` | S4 Company | ○ | |
| `/map` | S5 Map | ○ | 하단 시트가 탭바 위에 겹침 |
| `/notifications` | S6 Notifications | ✕ | `/`에서 진입, 모달성 |

## 4. 디자인 토큰 — `app/globals.css`

S1~S6 산출물에서 실측한 값 그대로. **하드코딩 금지, 전부 변수로.**

```css
:root {
  --bg:            #171717;
  --surface:       #212121;
  --hairline:      #2E2E2E;
  --text:          #F5F5F5;
  --text-2:        #A3A3A3;
  --text-3:        #6B6B6B;
  --accent:        #22D3EE;
  --hold:          #C084FC;
  --risk-critical: #FF3B30;
  --risk-high:     #FF8A00;
  --risk-medium:   #E0A800;
  --risk-low:      #22C55E;
  --on-color:      #171717;   /* 모든 색면 위 글자색 */

  --pad:      20px;   /* 좌우 패딩 */
  --topbar:   40px;
  --sec-gap:  28px;   /* 섹션 간격 */
  --lbl-gap:  12px;   /* 섹션 라벨 아래 */
  --row-gap:  14px;   /* 행 내부 가로 */
  --stack:     5px;   /* 행 내부 세로 */
  --mark-w:   20px;   /* 마커·순번 열 고정폭 */
}
```

타이포는 유틸리티 클래스로 고정한다. **32px은 존재하지 않는다.**

```css
.t-h1    { font: 700 24px/30px Pretendard, sans-serif; letter-spacing: -.02em; }
.t-h2    { font: 700 17px/24px Pretendard, sans-serif; }
.t-body  { font: 500 15px/22px Pretendard, sans-serif; }
.t-meta  { font: 400 13px/18px Pretendard, sans-serif; }
.t-label { font: 700 11px/12px Pretendard, sans-serif; letter-spacing: .08em; text-transform: uppercase; }
.t-mark  { font: 700 12px/1 Pretendard, serif; }   /* 한자 — serif 폴백 유지 필수 */
.t-badge { font: 700 12px/1 Pretendard, sans-serif; }
.tnum    { font-variant-numeric: tabular-nums; }
```

**전역 금지 규칙 — lint 수준으로 강제할 것**

```
border-radius: 0  (예외: 체크박스 999px 하나뿐)
box-shadow: none  (전역, 예외 없음)
이모지 금지        (국가는 VN / ID / TH)
카드 박스 금지     (행 구분은 border-top: 1px solid var(--hairline))
전부 좌측 정렬     (예외: S5 시트 드래그 핸들)
```

## 5. 데이터 모델 — `types/neo.ts`

PRD v2 §5를 그대로 옮긴다.

```ts
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type LawStatus = 'active' | 'hold' | 'scheduled';
export type Category  = 'labeling' | 'safety' | 'packaging' | 'customs';

export interface Law {
  id: string;                    // 'VN-2026-037'
  officialRef: string;           // 'DECREE 37/2026'
  title: string;
  country: 'VN';
  category: Category;            // Priority와 매칭되는 키
  status: LawStatus;
  riskLevel: RiskLevel;
  effectiveDate: string;         // ISO
  deadline?: string;             // 경과규정 종료일
  transitionNote?: string;
  changes: { before: string; after: string }[];
  affectedProductIds: string[];
  actionIds: string[];
  source: {
    url: string; publisher: string; publishedAt: string;
    originalLang: 'vi' | 'en'; lastVerified: string;
  };
}

export interface Action {
  id: string; lawId: string; title: string;
  owner: string;                 // '품질팀'
  effort: string;                // '2주'
  dueDate?: string;
  overdue?: boolean;
}

export interface Product { id: string; name: string; hsCode: string; impact: RiskLevel; }
export interface Priority { id: string; name: string; category: Category; }
export interface Company  { name: string; industry: string; countries: string[]; }

export interface Notification {
  id: string;
  type: 'deadline' | 'status' | 'new' | 'done';
  lawId?: string; title: string; body: string;
  at: string; 
}
```

한자 마커와 색은 **한 곳에서만** 정의한다.

```ts
export const STATUS_MARK  = { active:'施', hold:'留', scheduled:'豫' } as const;
export const STATUS_COLOR = {
  active: 'var(--accent)', hold: 'var(--hold)', scheduled: 'var(--text-3)',
} as const;
export const RISK_COLOR = {
  critical:'var(--risk-critical)', high:'var(--risk-high)',
  medium:'var(--risk-medium)',     low:'var(--risk-low)',
} as const;
```

**목 데이터**: `data/laws.json`, `products.json`, `company.json`, `notifications.json`.
PRD v2 §10의 법률 5건·제품 4건·회사 1건, S6 알림 6건을 그대로 넣는다.

## 6. localStorage 설계

정적 JSON은 읽기 전용이고, **사용자가 만든 상태만** 저장한다.

| 키 | 타입 | 쓰는 곳 |
|---|---|---|
| `neo.actions.done` | `string[]` | S1 체크리스트, S3 체크리스트 |
| `neo.notifications.read` | `string[]` | S6, "모두 읽음" |
| `neo.priorities` | `Priority[]` | S4 `+ 영역 추가` |
| `neo.filters` | `{ preset: string; sort: 'date'\|'risk' }` | S2 |
| `neo.lastSync` | ISO string | 전역 상단바 |

**주의 3가지**

1. `useSyncExternalStore` 또는 마운트 후 읽기로 처리한다. SSR에서 `localStorage`를 읽으면 hydration mismatch가 난다.
2. 모든 접근을 `try/catch`로 감싼다. 시크릿 모드에서 throw한다.
3. **액션 완료 상태는 S1과 S3 양쪽에 즉시 반영돼야 한다.** 이게 PRD의 SC-2를 만족시키는 핵심이므로 단일 스토어 훅(`useActionState`)으로 묶는다. 화면별로 따로 읽으면 어긋난다.

## 7. 공용 컴포넌트

디자인이 원자 단위로 반복되므로 이것부터 만든다.

```
components/
  TopBar.tsx        좌/우 슬롯, 높이 40
  TabBar.tsx        텍스트 4개, 활성 탭 상단 2px --accent
  Label.tsx         .t-label
  Mark.tsx          한자 마커. width 20 고정, .t-mark, STATUS_COLOR
  Badge.tsx         색면 배지. height 22, padding 0 7, 배경=tone, 색=--on-color
  ColorBlock.tsx    색면 헤드라인. height 52, padding 0 14
  Row.tsx           border-top 1px, gap 14, 높이 66|62|44 variant
  RiskText.tsx      'HIGH' 등 위험도 단어를 해당 색 텍스트로
  DotGeo.tsx        neo-dots 포팅. props: mode 'globe'|'asia'
  Sheet.tsx         S5 하단 시트. shadcn Drawer 기반, radius 0 강제
  Checkbox.tsx      16×16 원형. 이 앱 유일한 곡선
  EmptyState.tsx / Skeleton.tsx / ErrorState.tsx / OfflineBar.tsx
```

`Row`의 높이 3종(66 액션형 / 62 정보형 / 44 단문형)을 variant로 고정해두면 6화면이 저절로 맞는다.

## 8. 상태 화면

| 상태 | 위치 | 내용 |
|---|---|---|
| 빈 | `/laws` 필터 0건 | Body "조건에 맞는 법률이 없습니다" + `--accent` 밑줄 링크 "필터 초기화". 일러스트 없음 |
| 빈 | `/company` 우선순위 0 | `+ 영역 추가` 타일만 + Meta "관심 규제 영역을 추가하면 맞춤 분석이 시작됩니다" |
| 로딩 | 모든 목록 | `--surface` 블록 스켈레톤. **shimmer 금지** — 발광이다. opacity 펄스만 |
| 에러 | 데이터 실패 | Body "규제 데이터를 불러오지 못했습니다" + 밑줄 링크 "다시 시도" |
| 오프라인 | 전역 | 상단 고정 바, 배경 `--risk-medium`, 글자 `--on-color`, "오프라인 · 09.03 08:12 기준 캐시" |

**스켈레톤 shimmer를 쓰지 않는 이유**: 좌→우로 흐르는 광택이 곧 글로우다. 디자인 절대 규칙과 충돌한다.

## 9. PWA

```json
// public/manifest.json
{
  "name": "NEO", "short_name": "NEO",
  "display": "standalone", "orientation": "portrait",
  "theme_color": "#171717", "background_color": "#171717",
  "start_url": "/",
  "icons": [192, 512, maskable]
}
```

- 서비스워커는 **Serwist(`@serwist/next`)** 를 쓴다. `next-pwa`는 사실상 유지보수가 멈춰 App Router에서 문제가 잦다.
- 캐싱: `data/*.json`과 `public/geo/countries-110m.json`은 **stale-while-revalidate**, 정적 자산은 precache.
- **Web Push는 UI만.** S6의 "시행일 알림 켜기" 블록은 권한 요청까지만 하고 실제 발송 서버는 만들지 않는다 — V6 범위 밖이다. 이 점을 코드 주석에 남긴다.
- 설치 프롬프트: 2회차 방문 시 `/` 하단에 배너. `beforeinstallprompt` 보관.

## 10. 작업 순서

각 단계는 **검증 기준**이 통과해야 다음으로 넘어간다.

**1~2단계는 이미 되어 있다.** `seed/` 아래에 타입·목데이터·토큰이 검증까지 끝난 상태로 들어 있다.
스캐폴드 후 제자리로 옮기기만 하면 된다.

```
1. 스캐폴드
   create-next-app + shadcn init + Pretendard
   seed/styles/tokens.css → app/globals.css 로 병합
   → 검증: 빈 페이지가 #171717 배경, Pretendard로 렌더

2. seed/ 배치  (내용은 이미 완성됨 — 새로 쓰지 말 것)
   seed/types/neo.ts  → types/neo.ts
   seed/data/*.json   → data/
   그 후 seed/ 삭제
   → 검증: tsc 통과, laws.length === 5, actions.length === 9
   → 참조무결성은 이미 통과했다: 고아 액션 0, 누락 제품 0,
     D-Day가 D-45 / D-14 / 기한경과(-19)로 디자인과 일치

3. 공용 컴포넌트 9종
   TopBar TabBar Label Mark Badge ColorBlock Row RiskText Checkbox
   → 검증: 임시 /kitchen-sink 페이지에서 전부 렌더,
           DevTools로 box-shadow 0건 / border-radius는 체크박스뿐

4. S1 Home
   → 검증: 산출물 스크린샷과 나란히 비교, 간격·색·글자크기 일치

5. S2 Laws + S3 Law Detail
   → 검증: S2 행 클릭 → /laws/[id] 이동,
           S3에서 MUST DO가 WHAT CHANGED보다 위

6. useActionState (localStorage)
   → 검증: S3에서 액션 체크 → S1 "MUST DO NOW"에 즉시 반영,
           새로고침 후에도 유지, 시크릿 모드에서 크래시 없음

7. S4 Company + S6 Notifications
   → 검증: S4 + 영역 추가가 localStorage에 쌓임,
           S6 읽음 처리가 S1 배지 숫자에 반영

8. DotGeo 포팅
   d3-geo·topojson-client npm 설치, countries-110m.json을 public/geo/에
   → 검증: 네트워크 차단 상태에서도 지구본·지도가 그려짐 (CDN 의존 제거 확인)

9. S5 Map
   → 검증: 시트가 직각, 탭바 위에 겹침, 마커 정사각

10. 상태 화면 5종
    → 검증: 각 상태를 강제 진입시켜 렌더 확인, 스켈레톤에 shimmer 없음

11. PWA
    manifest, Serwist, 오프라인 바, 설치 배너
    → 검증: Lighthouse PWA 통과, 오프라인에서 6화면 전부 열림

12. 최종 대조
    → 검증: 6화면 스크린샷 vs 디자인 산출물,
            §4 금지 규칙 전수 검사 (box-shadow / radius / 이모지 / 중앙정렬)
```

## 10-1. 시작 전 반드시 읽을 것

**`docs/DISCREPANCIES.md`** — 디자인 산출물끼리 어긋나는 지점 4건과 그 판단이 정리돼 있다.
특히 S3의 `AFFECTED — 3`은 **4로 고쳐야 한다.**

**기준 날짜.** 모든 D-Day는 `seed/data/meta.json`의 `referenceDate`(2026-09-03) 기준이다.
`new Date()`를 쓰면 D-Day가 디자인과 어긋난다. 이 값을 단일 출처로 쓴다.

**디자인에 박힌 숫자는 전부 파생값으로 만든다.** `대응 필요 3건`, `MUST DO — 4`,
`PRIORITIES — 3`, `읽지 않음 3`, `미완 액션 N` — 문자열로 박으면 localStorage 상태가
바뀌는 순간 거짓말이 된다.

## 11. Claude Code 시작 프롬프트

새 세션에 이 문서와 함께 붙여넣는다.

```
NEO 앱 PWA를 만든다. 이 리포는 비어 있다.

첨부한 3개 문서가 명세다:
- NEO-PRD-v2.md            무엇을 만드는가
- NEO-claude-design-prompts.md  화면별 확정 디자인 (실측값 포함)
- step3-build-plan.md      이 작업 계획서

작업 계획서 §10의 12단계를 순서대로 진행한다.
각 단계의 "검증" 항목이 통과해야 다음 단계로 넘어간다.
검증에 실패하면 다음으로 넘어가지 말고 멈춰서 보고한다.

지켜야 할 것:
- §4의 디자인 토큰을 변수로만 쓴다. 색상·간격 하드코딩 금지.
- §4 전역 금지 규칙(box-shadow / border-radius / 이모지 / 카드 박스 /
  중앙 정렬)은 예외 없이 지킨다. 체크박스 원형 하나만 예외다.
- 요청하지 않은 기능을 추가하지 않는다. 추상화는 실제로 2번 이상
  반복될 때만 만든다.
- 애매한 부분이 있으면 임의로 정하지 말고 먼저 질문한다.

1단계부터 시작한다.
```

## 12. 이 계획에서 의도적으로 뺀 것

| 항목 | 이유 |
|---|---|
| 온보딩 3단계 | V6 범위 밖. 목 데이터로 이미 개인화된 상태를 보여준다 |
| Web Push 발송 서버 | 권한 UI만으로 흐름 검증에 충분 |
| Magic UI / Aceternity / React Bits | `neo-dots.js`가 지오그래피를 커버하고, 나머지는 전부 글로우 기반이라 탈락 |
| 다크/라이트 토글 | 단일 테마 확정 |
| 로그인·다중 사용자 | localStorage로 충분 |
