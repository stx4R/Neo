# NEO — 3차 작업 지시 (Claude Code용)

2차 작업의 **작업 A · B1 · B2 · B3 · B4 · B5 + 공용 법령 구조**가 끝나 `main`에 올라가 있다.
남은 것은 **B6 · B7 · B8 · B9**다.

이 문서는 2차 지시서(`docs/` 밖 `NEO-phase2-prompt.md`)를 이어받는다.
2차 지시서의 §1(변하지 않는 규칙)과 §B-3(조사·기록 규칙)은 **그대로 살아 있다.**
여기서 다시 적지 않은 것은 폐기된 것이 아니라 그대로다.

---

## 0. 먼저 읽어라 — 순서대로

```
CLAUDE.md                          프로젝트 절대 규칙
docs/DISCREPANCIES.md              §35~§88이 2차 작업 판단 전부다. 가장 중요하다
docs/DATA-SOURCES.md               법령 조사 근거. B6는 이 문서를 이어 쓰는 일이다
docs/PRD-v2.md · docs/build-plan.md
design/NEO Setup v4.dc.html        S7·S8·S9·IC 아트보드. 신규 화면의 소스 오브 트루스
design/NEO-screens.dc.html         기존 6화면 아트보드
```

`docs/DISCREPANCIES.md`는 길지만 **§71~§88은 반드시 읽어라.** D-Day 처리, 알림 파생,
공용 법령 구조가 거기 있고, 모르면 같은 결정을 다르게 내린다.

### 지금 코드가 어떻게 돌아가는가 — 30초 요약

```
localStorage 'neo.profile'  →  useProfile()  →  useDataset()  →  Dataset
                                                                   ├ today      (날짜 파생값의 유일한 출처)
                                                                   ├ laws       (조합 파일 + 공용 파일, originScope 필터 통과)
                                                                   ├ actions    (품목으로 걸러짐)
                                                                   ├ products   (사용자 제품)
                                                                   ├ hiddenByOrigin
                                                                   └ empty
                                          ↓
              lib/derive.ts의 모든 파생 함수가 Dataset을 첫 인자로 받는다
                                          ↓
                                   6화면 + /setup
```

- 프로필이 없으면 `components/ProfileGate.tsx`가 어느 경로에서든 `/setup`으로 보낸다
- `useDataset()`이 `null`인 한 프레임이 있다(hydration). 그 사이는 `ComboPending` 스켈레톤이다
- 날짜는 `Dataset.today` 하나에서만 나온다. `new Date()`는 `lib/dday.ts` 한 곳뿐이다
- `/laws/[id]`만 서버 컴포넌트다. 프로필에 매인 조각 셋(`Affected` · `MustDoList` ·
  `OpenActionsBar` · `HeaderBadge`)만 클라이언트로 떼어냈다

---

## 1. 절대 어기지 말 것 — 2차에서 이미 깨졌다 되돌린 것들

아래는 전부 **실제로 한 번 잘못 만들었다가 검증에서 잡힌 것**이다. 다시 하지 마라.

1. **0건에 위험도 색면을 쓰지 않는다.** 미지원 조합에서 `--risk-critical` 빨간 색면에
   "대응 필요 0건"이 떴었다. 아무 일도 없는데 화면이 가장 위급해 보인다 (§64)
2. **`new Date()`로 D-Day를 계산하지 않는다.** 정적 배포라 빌드한 날이 영원히 오늘이 되고
   hydration이 깨진다. `Dataset.today`를 쓴다 (§75)
3. **`useSyncExternalStore`가 렌더한 값으로 리다이렉트를 판정하지 않는다.**
   hydration 렌더는 서버 스냅샷을 쓴다 — 프로필이 있는 사용자가 새로고침마다 튕겼다 (§57)
4. **기한이 없는 법령에 "기한 경과"를 붙이지 않는다.** `미이행`이다 (§81)
5. **품목 이름을 식품 기준으로 적지 않는다.** `식품안전·인증` → `안전·인증` (§80)
6. **버튼에 `width: auto`를 믿지 않는다.** shrink-to-fit이라 색면·헤어라인이 글자 뒤에서 끊긴다 (§42)
7. **하단 고정 바는 `bottom: 0` + `padding-bottom: var(--safe-bottom)`.**
   `bottom`에 안전영역을 주면 바닥에 검은 띠가 남는다 (§35)
8. **뷰포트 단위로 프레임 높이를 잡지 않는다.** `position: fixed; inset: 0`이다.
   `100dvh`는 iOS Safari에서 굳는다 (§39)
9. **이펙트 안에서 `setState`를 하지 않는다.** eslint가 에러로 잡는다.
   클라이언트 전용 값은 `useSyncExternalStore`로 읽는다 (`HeaderBadge.tsx` 참고)
10. **H1에 마침표를 찍지 않는다.** 아트보드에는 있지만 사용자가 전부 빼라고 했다 (§47)

---

## 2. B6 — 나머지 10조합 법령 데이터 (가장 큰 덩어리)

### 현재 데이터 현황

| 파일 | 법령 | 액션 | 상태 |
|---|---|---|---|
| `VN-shared.json` | 1 | 4 | ✅ `DECREE 37/2026` 상품 라벨 |
| `VN-food.json` | 4 | 5 | ⚠ 1단계 시드. **재검증 필요** |
| `VN-cosmetics.json` | 4 | 11 | ✅ B5에서 조사 완료 |
| `VN-electronics.json` | 0 | 0 | ❌ |
| `JP-*.json` (4개) | 0 | 0 | ❌ |
| `US-*.json` (4개) | 0 | 0 | ❌ |
| `ID-*.json` (4개) | 0 | 0 | ❌ |

### 조사·기록 규칙 — 2차 §B-3 그대로. 요약하면

1. **모르는 건 비운다. 지어내지 않는다.** 이 프로젝트에서 가장 큰 실패는
   그럴듯한 값을 채우는 것이다
2. **독립된 출처 2개 이상 교차확인.** 번호·시행일·핵심 변경이 일치해야 기록한다.
   일치하지 않으면 **기록하지 말고 보고한다**
3. 1차 출처(정부 관보·소관 부처)면 `sourceTier: 'official'`, 로펌·시험인증기관 등
   2차만 확보되면 `'secondary'`. **2차를 1차인 척하지 않는다**
4. `source.lastVerified`는 **네가 실제로 그 URL을 연 날짜**
5. `summary`(= `title`)는 조문 해석이 아니라 **"그래서 뭘 해야 하는가"**
6. `changes[]`는 실제로 개정된 조문만. 신규 규정이면 빈 배열이고 화면에서 그 섹션이 사라진다
7. `dueDate`·`deadline`은 **법령에 명시된 기한이 있을 때만.** 없으면 `null`
8. `hsPrefixes`로 제품-법령 매칭이 실제로 성립하는지 확인한다
9. 각국 실제 표기를 쓴다 — 일본 `食品表示基準`, 미국 `21 CFR 101`, 인도네시아 `PerBPOM`
10. 조사 과정과 판단을 `docs/DATA-SOURCES.md`에 이어 쓴다. **제외한 법령과 그 사유까지**

### B5에서 확정된 서술 톤 — 사용자 승인 완료

`data/laws/VN-cosmetics.json`을 **그대로 본보기로 삼아라.** 사용자가 이 밀도와
서술 톤으로 진행하라고 확정했다.

- 법령 4~6건 / 법령당 액션 2~4건
- `title`은 한국어로 "무엇이 바뀌었고 왜 중요한가" 한 줄
- `changes[].before/after`는 실제 조문 대비. 없으면 빈 배열
- 액션은 실제 의무에서 도출. `owner`는 품질팀 / 디자인 / 영업 / 구매 / 마케팅 / 경영
- **제외한 것을 반드시 남긴다.** VN-cosmetics는 3건을 제외하고 사유를 적었다

### 작업 방식

- **조합 1개 = 커밋 1개.** 10개를 한 번에 쏟지 않는다
- 조합마다 `npm run check-data` 통과 + 화면 렌더 확인
- 조합마다 `docs/DATA-SOURCES.md`에 절을 추가한다

### 공용 법령을 만나면

품목을 가리지 않는 법령(상품 라벨, 통관 등)은 `data/laws/<국가>-shared.json`에 넣는다.
**조합 파일마다 복사하지 않는다** — 법령 id가 전역에서 유일해야 `/laws/[id]` 정적 생성과
id 조회가 성립한다.

```jsonc
// <국가>-shared.json
{
  "laws": [{
    "id": "JP-2026-001",
    "itemCategories": ["food", "cosmetics", "electronics"],  // 2개 이상이어야 한다
    "hsPrefixes": [],            // 빈 배열 = 품목을 가리지 않는다 (공용 파일에서만 허용)
    "actionIds": ["JP-a-001-all-01", "JP-a-001-food-01"]
  }],
  "actions": [
    { "id": "JP-a-001-all-01",  "lawId": "JP-2026-001", "…": "…" },
    { "id": "JP-a-001-food-01", "lawId": "JP-2026-001", "itemCategories": ["food"], "…": "…" }
  ]
}
```

`check-data.mjs`가 규칙을 강제한다 — 품목이 하나뿐인 법령이 공용에 있거나,
조합 파일 액션에 `itemCategories`가 붙어 있으면 실패한다.

### `originScope` — KR 출발분만 채운다

출발국별로만 적용되는 요건(수출국 정부 발행 위생증명서, 수출국 지정 등록시설 등)에만 쓴다.
값이 있으면 그 출발국일 때만 노출되고, `Dataset.hiddenByOrigin`이 0이 아니면
S2 하단에 한 줄이 뜬다. **지금 데이터에는 `originScope`가 하나도 없다.**
B6에서 실제로 해당하는 것이 나오면 채운다.

### ⚠ B6에서 반드시 같이 정리할 것 — VN-food 재검증

`VN-food.json`의 4건(`110/2026` · `29/2023` · `46/2026` · `15/2018`)은
**1단계 시드 작성 시점의 출처만 있고 2차 작업에서 교차 재확인하지 않았다.**
`DATA-SOURCES.md` 맨 아래에 그렇게 적혀 있다. 같은 기준으로 다시 훑어라.

그리고 하나 확정할 것:

> `DECREE 37/2026/ND-CP`의 인쇄 포장재 경과 종료일이 **데이터는 `2028-01-22`인데
> 출처 표현은 "2026-01-23부터 2년"이라 `2028-01-23`으로도 읽힌다.**
> 하루 차이가 D-Day에 그대로 나온다. 원문(`english.luatvietnam.vn` 또는 베트남 관보)으로
> 확정하고 `data/laws/VN-shared.json`의 `deadline`·`transitionEndsAt`을 고쳐라.

---

## 3. B7 — 화면 반영 · 남은 세 가지

### B7-1. 지구본 점 색 확정

명세 `#3A3A3A` vs 원본 `#6B6B6B` 충돌이 아직 미해결이다.
지금 `--geo-dot: #3A3A3A`로 두고 있지만 **판단 근거를 기록하지 않았다.**

실제 렌더를 보고 **배경 `#171717` 위에서 지형이 읽히되 항로·마커를 압도하지 않는 쪽**으로
정하고, 값을 `--geo-dot`에 고정한 뒤 `docs/DISCREPANCIES.md`에 근거를 적어라.
S1 지구본과 S5 지도 둘 다 확인한다(S1은 `--text-3` 기본값, S5는 `--geo-dot`을 넘긴다 —
이 불일치도 같이 정리할 것).

### B7-2. PWA 아이콘 — 아트보드 IC 안 A로 교체

지금 `public/icons/`의 4개는 **1차 작업의 픽셀아트 법봉**이다(`scripts/make-icons.mjs`가
`design/mobile.png`에서 생성). 2차 지시서 §B-8이 **안 A(시안 색면 + 검은 N)** 로 확정했다.

아트보드 실측값(`design/NEO Setup v4.dc.html` IC 섹션):

```
캔버스 512×512 · 배경 #22D3EE
글리프 "N" — Pretendard 700 · 340px · letter-spacing -.02em · color #171717

purpose "any"      → 좌하단 정렬  left: 56px, bottom: 24px   (192·512 둘 다)
purpose "maskable" → 정중앙 정렬                              (512)
```

★ **좌하단 정렬을 maskable에 쓰면 잘린다.** maskable 안전영역은 캔버스 중앙 지름 410px
(아트보드가 256 축소본에 205px 원으로 그려 놨다)인데 좌하단 배치는 그 밖으로 크게 나간다.
아트보드도 안전영역 원을 **정중앙 버전에만** 겹쳐 그렸다.

내보낸 뒤 **실제로 원형·둥근사각 마스크를 씌워 "N"이 잘리지 않는지 확인한다.**
`apple-touch-icon-180.png`도 같이 갈아야 한다(iOS는 maskable을 모르므로 `any` 어법).

`scripts/make-icons.mjs`는 픽셀아트 전용이라 재사용할 수 없다. 새로 쓰거나 갈아엎어라.
**외부 이미지 라이브러리를 추가하지 않는다** — 의존성 추가 금지가 살아 있다.
기존 스크립트가 zlib만으로 PNG를 인코드하는 방법을 보여 준다.

### B7-3. 미해결로 남은 자리 표시들

아직 "동작 미정"인 채 렌더만 하는 것들이다. **없앨지 살릴지 정해라.**

| 위치 | 지금 상태 |
|---|---|
| `app/company/page.tsx:45` | 우상단 `설정` — 동작 없음 |
| `app/company/page.tsx:178` | `맞춤 분석 다시 실행` — 동작 없음 |
| `app/laws/[id]/page.tsx:54` | 우상단 `저장` — 동작 없음 |
| `app/map/page.tsx:287` | `국가 검색` — 비기능. 지원 국가가 4개뿐이라 거를 것이 적다 |

**동작이 없으면 지우는 쪽이 심사에 강하다.** 눌러도 아무 일도 없는 버튼이
넷이나 있으면 프로토타입으로 읽힌다. 살릴 것만 살려라.

---

## 4. B8 — 심사 대응

2차 지시서 §4 전 항목. 아직 하나도 검증하지 않았다.

- [ ] `next build` 무경고 통과 · `tsc --noEmit` 통과 — **현재 통과 중이나 B6 후 재확인**
- [ ] Lighthouse: PWA 설치 가능, **접근성 90 이상**
- [ ] **오프라인**: 네트워크 차단 상태에서 6화면 + `/setup` 전부 열린다.
      16개 법령 파일과 `countries-110m.json`이 전부 캐시되는지 (CDN 의존 0건)
- [ ] **터치 타겟 최소 44px** — 탭바, 목록 행, 체크박스, `/setup` 선택 행,
      S4의 `×` 버튼(지금 20px 폭이다 — **확인 필요**)
- [ ] **색 대비 실측** — 위험도 색면 위 `--on-color`, `--text-3 #6B6B6B` on `--bg #171717`.
      후자는 본문에 쓰기엔 대비가 낮다. Meta·비활성 라벨 외에 쓰이는 곳이 있으면 보고
- [ ] **상태 화면 전수**: 프로필 없음 / 조합 데이터 없음 / 필터 결과 0 / 로딩 / 에러 / 오프라인
- [ ] `README.md`에 데이터 출처 정책과 지원 범위(4×3) 명시.
      **"실시간 법령 수집이 아니라 수동 검증된 데이터셋"이라는 사실을 숨기지 않는다.**
      이걸 명시하는 쪽이 심사에서 강하다
- [ ] 금지 규칙 전수: `box-shadow` 0 / `border-radius`는 체크박스만 / 이모지 0 / 중앙정렬 0

**서비스워커 프리캐시 목록 확인**: `components/ServiceWorker.tsx`가
`allLaws`에서 라우트를 만든다. B6로 법령이 늘면 자동으로 따라가지만,
**실제로 캐시되는지는 확인해야 한다.**

---

## 5. B9 — 배포 + 실기기 확인

배포 URL: <https://neo-tau-six.vercel.app/> (GitHub `main` 푸시로 자동 배포)

- 아이폰 홈 화면에 추가한 standalone 상태에서 확인한다
- **4개 조합 이상 바꿔가며** 확인 — `/setup`부터 다시 타고, Company에서 변경도 해 본다
- 탭바가 화면 최하단에 붙는가, 마지막 행이 완전히 드러나는가
- Safari 브라우저 상태(툴바 펼침/접힘 양쪽)에서도 확인 — §39가 그 버그다

---

## 6. 검증 명령

```bash
npm run check-data     # 참조무결성. 조합을 하나 완성할 때마다 돌린다
npx tsc --noEmit
npx eslint
npx next build
```

`npm run dev`는 Browser 도구(`preview_start`)로 띄운다. Bash로 dev 서버를 돌리지 않는다.

**실기기 기하 재현법** — `env()`는 브라우저에서 0이라 이렇게 흉내 낸다:

```js
document.documentElement.style.setProperty('--safe-top', '59px');
document.documentElement.style.setProperty('--safe-bottom', '34px');
```

뷰포트는 402×874(iPhone 16 Pro)로 두고 잰다. 375(SE)와 1400(데스크톱)도 확인한다.

---

## 7. 시작 전에 확인할 것

1. `npm run check-data`가 통과하는가 (조합 16 · 법령 9 · 액션 20이 나와야 한다)
2. 웹 검색·URL 열람이 가능한가. **B6는 이게 없으면 진행할 수 없다.**
   불가능하면 B7부터 하고 보고한다
3. `design/NEO Setup v4.dc.html`이 리포에 있는가 (S9·IC를 여기서 실측한다)
4. `docs/DATA-SOURCES.md`의 VN-cosmetics 절을 읽었는가.
   **B6는 그 절을 10번 더 쓰는 일이다**

애매하면 임의로 정하지 말고 먼저 질문한다. 각 단계 검증이 통과해야 다음으로 간다.
실패하면 넘어가지 말고 멈춰서 보고한다.

**B6의 첫 조합(`VN-electronics` 권장 — 같은 국가라 법체계가 익숙하다)을 완성한 뒤
한 번 멈추고 보고한다.** 그다음 나머지 9개를 같은 기준으로 진행한다.
