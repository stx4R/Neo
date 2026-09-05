# NEO — 4차 작업 지시 (Claude Code용)

3차 작업에서 **B6의 첫 조합(`VN-electronics`)** 과 **EPR 공용 이관**이 끝나 `main`에 올라가 있다.
남은 것은 **B6의 나머지 10조합 · B7 · B8 · B9**다.

이 문서는 3차 지시서(`docs/NEO-phase3-prompt.md`)를 이어받는다.
3차 §1(절대 어기지 말 것)은 **그대로 살아 있고** 아래 §1에 새로 배운 것 5개를 붙였다.
여기서 다시 적지 않은 것은 폐기된 것이 아니라 그대로다.

---

## 0. 먼저 읽어라 — 순서대로

```
CLAUDE.md                          프로젝트 절대 규칙
docs/DISCREPANCIES.md              §71~§94가 판단 전부다. 가장 중요하다
docs/DATA-SOURCES.md               법령 조사 근거. B6는 이 문서를 이어 쓰는 일이다
docs/NEO-phase3-prompt.md          3차 지시서. §1·§2의 조사 규칙이 살아 있다
docs/PRD-v2.md · docs/build-plan.md
design/NEO Setup v4.dc.html        S7·S8·S9·IC 아트보드. IC는 B7-2에서 실측한다
design/NEO-screens.dc.html         기존 6화면 아트보드
```

`DISCREPANCIES.md`는 길다. **§71~§94는 반드시 읽어라.** D-Day 처리, 알림 파생,
공용 법령 구조, 그리고 3차에서 새로 배운 §89~§94가 거기 있다.

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
- `/laws/[id]`만 서버 컴포넌트다. 프로필에 매인 조각 넷(`Affected` · `MustDoList` ·
  `OpenActionsBar` · `HeaderBadge`)만 클라이언트로 떼어냈다
- 법령 파일은 조합별 12개 + 공용 4개 = 16개다. `lawSetOf(country, category)`가
  조합 파일과 공용 파일을 합치면서 법령은 `law.itemCategories`로,
  액션은 `action.itemCategories`로 거른다 (§85)

### 현재 데이터

```
npm run check-data
→ 조합 16개 (내용 있음 4) · 법령 14 · 액션 39 · 출처 1차 4 / 2차 10
```

| 파일 | 법령 | 액션 | 1차/2차 | 상태 |
|---|---|---|---|---|
| `VN-shared.json` | 2 | 10 | 1/1 | `DECREE 37/2026` 라벨 · `DECREE 110/2026` EPR |
| `VN-cosmetics.json` | 4 | 11 | 1/3 | B5 완료 |
| `VN-electronics.json` | 5 | 16 | 1/4 | **B6 완료. 이걸 본보기로 삼아라** |
| `VN-food.json` | 3 | 2 | 1/2 | 재검증 필요. 법령이 3건뿐이라 목표(4~6) 미달 |
| `JP-*.json` (4개) | 0 | 0 | — | 미착수 |
| `US-*.json` (4개) | 0 | 0 | — | 미착수 |
| `ID-*.json` (4개) | 0 | 0 | — | 미착수 |

---

## 1. 절대 어기지 말 것

3차 §1의 10개는 그대로다. 요약하면:
0건에 위험도 색면 금지 / `new Date()`로 D-Day 금지 / `useSyncExternalStore` 렌더값으로
리다이렉트 판정 금지 / 기한 없는 법령에 "기한 경과" 금지(`미이행`이다) /
품목 이름을 식품 기준으로 짓지 말 것 / 버튼에 `width:auto` 금지 /
하단 고정 바는 `bottom:0` + `padding-bottom: var(--safe-bottom)` /
프레임 높이에 뷰포트 단위 금지(`position:fixed; inset:0`) / 이펙트 안 `setState` 금지 /
H1에 마침표 금지.

**3차에서 새로 배운 것 5개를 더한다. 전부 실제로 잡힌 것이다.**

11. **2차 출처가 여럿 일치해도 "적용 범위"는 믿지 마라.** 영문 컴플라이언스 매체
    셋이 `CIRCULAR 36/2026/TT-BKHCN`을 "IT·통신 전용"이라 썼는데 원문은 과학기술부
    소관 **전 품목**이었다. 그 말을 믿었으면 전기밥솥을 통째로 빼먹었다.
    번호·날짜는 베껴 쓰기 쉬워 잘 맞지만 범위는 매체가 자기 독자에 맞춰 잘라 쓴다 (§89)

12. **법령에 날짜가 적혀 있다고 다 `deadline`이 아니다.** LED 통칙의 `2027-01-01`은
    HS 9405.11.99(조명기구)의 유예 종료일이지 우리 제품(LED 전구 8539.52)의 기한이
    아니었다. 넣었으면 D-117이 떴을 것이다. **그 날짜가 이 법령의 `hsPrefixes`에
    걸리는 제품의 날짜인지 확인한 뒤에 넣는다** (§91)

13. **`sourceTier: official`은 관보·부처 원문 URL이 있을 때만 붙인다.**
    로펌·법률DB·지자체 소개 페이지는 전부 `secondary`다. `publisher` 문자열도
    2차 출처를 1차처럼 적으면 안 된다 (§93). **지금 데이터에 이 위반이 2건 남아 있다 —
    아래 §2-a를 보라**

14. **품목을 가리지 않는 법령을 조합 파일에 넣지 마라.** `DECREE 110/2026`(EPR)이
    `VN-food.json`에만 있어 화장품·전기전자 사용자가 자기 재활용 의무를 못 봤다.
    §82가 라벨 시행령에서 지적한 것과 똑같은 누락이다. `<국가>-shared.json`에 넣는다 (§92)

15. **액션 id를 정리한다고 바꾸지 마라.** `neo.actions.done`이 그 id를 담는다.
    이름이 옛 규칙(`VN-a-05`)이어도 그대로 둔다. 파일을 옮기는 것은 id를 건드리지
    않으므로 안전하다 (§52 · §92)

---

## 2. B6 — 남은 10조합 + 재검증

### 조사·기록 규칙 — 3차 §2 그대로. 요약하면

1. **모르는 건 비운다. 지어내지 않는다.** 이 프로젝트에서 가장 큰 실패는 그럴듯한
   값을 채우는 것이다
2. **독립된 출처 2개 이상 교차확인.** 번호·시행일·핵심 변경이 일치해야 기록한다.
   일치하지 않으면 **기록하지 말고 보고한다**
3. 1차 출처(정부 관보·소관 부처)면 `sourceTier: 'official'`, 로펌·법률DB·시험인증기관
   등 2차만 확보되면 `'secondary'`
4. `source.lastVerified`는 **네가 실제로 그 URL을 연 날짜**
5. `summary`(= `title`)는 조문 해석이 아니라 **"그래서 뭘 해야 하는가"**
6. `changes[]`는 실제로 개정된 조문만. 신규·현행 규정이면 빈 배열이고 화면에서
   WHAT CHANGED 섹션이 사라진다
7. `dueDate`·`deadline`은 **법령에 명시된 기한이 있을 때만.** 없으면 `null` (+ §1-12)
8. `hsPrefixes`로 제품-법령 매칭이 실제로 성립하는지 확인한다
9. 각국 실제 표기를 쓴다 — 일본 `食品表示基準`·`電気用品安全法`,
   미국 `21 CFR 101`·`16 CFR`, 인도네시아 `PerBPOM`·`SNI`
10. 조사 과정과 판단을 `docs/DATA-SOURCES.md`에 이어 쓴다. **제외한 법령과 그 사유까지**

### 본보기는 `VN-electronics.json`이다

3차에서 사용자 승인이 끝난 밀도·서술 톤이다. `DATA-SOURCES.md`의 「VN — 전기·전자」
절과 함께 읽어라. **B6는 그 절을 10번 더 쓰는 일이다.**

- 법령 4~6건 / 법령당 액션 2~4건
- `title`은 한국어로 "무엇이 바뀌었고 왜 중요한가" 한 줄
- `changes[].before/after`는 실제 조문 대비. 없으면 빈 배열
- `owner`는 품질팀 / 디자인 / 영업 / 구매 / 마케팅 / 경영
- **제외한 것을 반드시 남긴다.** VN-electronics는 4건을 제외하고 사유를 적었다

### 원문 PDF는 열어서 부속서까지 본다

`VN-electronics`에서 가장 값이 컸던 작업이다. 부처가 올린 PDF는 압축 스트림을 풀면
라틴 문자와 숫자가 그대로 나온다 — 성조 글자만 CID 폰트라 빠지지만 **HS 코드와
기술기준 번호는 전부 라틴·숫자라 표를 읽는 데 지장이 없다.**

```js
// PDF 텍스트 추출 — 외부 의존성 없이 zlib만 쓴다
import fs from 'node:fs';
import zlib from 'node:zlib';
const b = fs.readFileSync(pdfPath);
// 'stream' ~ 'endstream' 구간을 inflateSync 하고
// /\(((?:\\.|[^()\\])*)\)/g 로 리터럴 문자열을 뽑아 이어 붙인다
```

이렇게 해서 전기밥솥 `8516.60.10`이 부속서 I(고위험), 리튬배터리 `8507.60`이
부속서 II(중위험)에 있다는 것을 확인했다. 2차 출처만 봤으면 못 잡았다.

### 작업 방식

- **조합 1개 = 커밋 1개.** 10개를 한 번에 쏟지 않는다
- 조합마다 `npm run check-data` 통과 + 화면 렌더 확인
- 조합마다 `docs/DATA-SOURCES.md`에 절을 추가한다
- 여러 품목에 걸치는 법령은 `<국가>-shared.json`에. **조합 파일마다 복사하지 않는다** —
  법령 id가 전역에서 유일해야 `/laws/[id]` 정적 생성과 id 조회가 성립한다

`check-data.mjs`가 규칙을 강제한다 — 품목이 하나뿐인 법령이 공용에 있거나,
조합 파일 액션에 `itemCategories`가 붙어 있거나, 조합 파일의 `hsPrefixes`가 비어 있으면 실패한다.

### `originScope` — KR 출발분만 채운다

출발국별로만 적용되는 요건(수출국 정부 발행 위생증명서, 수출국 지정 등록시설 등)에만 쓴다.
**VN 3조합에는 하나도 없었다.** 미국 식품(FSVP·시설등록)과 일본 식품(수출시설 등록)에서
나올 가능성이 높다. 값이 있으면 그 출발국일 때만 노출되고 `Dataset.hiddenByOrigin`이
0이 아니면 S2 하단에 한 줄이 뜬다.

---

### 2-a. 먼저 할 것 — VN 마무리 `커밋 1개`

**`sourceTier`를 1차인 척하는 레코드가 2건 있다. 이게 가장 급하다.**

| 법령 | 지금 | 문제 |
|---|---|---|
| `VN-2026-046` (`VN-food.json`) | `official` · publisher `"베트남 정부 관보"` | URL이 **`vietanlaw.com` — 로펌이다.** §B-3 규칙 3 명백한 위반 |
| `VN-2026-037` (`VN-shared.json`) | `official` | URL이 `english.luatvietnam.vn` — **상용 법률DB**다. VN-cosmetics에서 지자체 정부 포털도 보수적으로 `secondary`로 뒀는데 이것만 `official`인 건 앞뒤가 안 맞는다 |

진짜 1차는 둘뿐이다 — `dav.gov.vn` 서명본 PDF(`VN-2026-647`), `mic.mediacdn.vn`
통칙 PDF(`VN-2026-036`). **관보 원문을 찾아 올리든가, 못 찾으면 `secondary`로 내려라.**

같이 처리할 것:

| 할 일 | 구체 내용 |
|---|---|
| `DECREE 37/2026` 경과일 확정 | 데이터는 `2028-01-22`, 출처 표현은 "2026-01-23부터 2년"이라 `2028-01-23`으로도 읽힌다. **고칠 곳은 `VN-shared.json`의 `deadline`과 `transitionEndsAt` 둘 다.** 하루가 D-503→D-504로 움직인다 |
| `CIRCULAR 29/2023` 재검증 | 영양성분 표시. 시드 출처 1개뿐 → 독립 출처 2개 이상 |
| `DECREE 46/2026` 재검증 | `status: hold`. **보류가 아직 유효한지**, `heldAt`이 실재 날짜인지 |
| `DECREE 15/2018` 재검증 | 자가공표 절차. 개정 논의가 있었다 — 개정됐으면 `changes` 갱신 |
| 법령 보충 | 3건 → 4~6건 |

### 2-b ~ 2-j. 나머지 9조합 `각 커밋 1개`

`JP` / `US` / `ID` × `food` / `cosmetics` / `electronics`.
`<국가>-shared.json` 3개는 조합 작업 중 공용 법령이 나올 때 채운다(VN에서 한 방식).

**shared 후보로 미리 의심되는 것** — 조사에서 확인하라:
- `ID` 할랄 인증 의무(JPH법) — 식품·화장품 둘 다 걸린다
- `US` 강제노동 심사(UFLPA) — 품목을 가리지 않는다
- `JP` 원산지·품질 표시 — 품목별 기준이 갈릴 수 있다

**조합 하나당 절차:**

1. 조사 → 번호·시행일·핵심 변경이 독립 출처 2개 이상에서 일치해야 기록
2. 관보·부처 원문 확보 시도 → `official`, 실패하면 `secondary`. **원문 PDF는 열어 부속서까지 본다**
3. HS 차등이 실재하는지 확인 — 기본 제품 4개가 갈리는가 (`data/categories.json`)
4. 여러 품목에 걸치면 `<국가>-shared.json`
5. `npm run check-data` → 화면 렌더 → `DATA-SOURCES.md` 절 추가 → 커밋

---

## 3. B7 — 화면 반영 3건

### B7-1. 지구본 점 색 확정

**지금 두 화면이 다른 색으로 렌더된다. 이게 확인된 사실이다.**

| 화면 | 코드 | 실제 색 |
|---|---|---|
| S1 지구본 | `app/page.tsx:121` — `dotColor`를 **안 넘긴다** | `--text-3` `#6B6B6B` |
| S5 지도 | `app/map/page.tsx:312` — `dotColor="var(--geo-dot)"` | `#3A3A3A` |

기본값은 `components/DotGeo.tsx:244`에 `var(--text-3)`로 박혀 있다.
`app/globals.css:99`가 `--geo-dot: #3A3A3A`인데 **판단 근거가 기록되지 않았다.**

할 일: 배경 `#171717` 위에서 두 화면의 실제 렌더를 비교하고
**지형이 읽히되 항로·마커를 압도하지 않는 쪽**으로 한 값을 정한다.
S1도 같은 경로를 타게 통일한다 — `DotGeo`의 기본값을 `--geo-dot`으로 바꾸는 쪽이
호출부 2곳을 고치는 것보다 낫다. 근거를 `DISCREPANCIES.md`에 적는다.

### B7-2. PWA 아이콘 — 아트보드 IC 안 A로 교체

지금 `public/icons/`의 4개는 **1차 작업의 픽셀아트 법봉**이다
(`scripts/make-icons.mjs`가 `design/mobile.png`에서 생성).
2차 지시서 §B-8이 **안 A(시안 색면 + 검은 N)** 로 확정했다.

아트보드 실측값(`design/NEO Setup v4.dc.html` IC 섹션):

```
캔버스 512×512 · 배경 #22D3EE
글리프 "N" — Pretendard 700 · 340px · letter-spacing -.02em · color #171717

purpose "any"      → 좌하단 정렬  left: 56px, bottom: 24px   (192·512 둘 다)
purpose "maskable" → 정중앙 정렬                              (512)
```

| 파일 | purpose | 정렬 |
|---|---|---|
| `icon-192.png` | any | 좌하단 |
| `icon-512.png` | any | 좌하단 |
| `icon-maskable-512.png` | maskable | **정중앙** |
| `apple-touch-icon-180.png` | (iOS는 maskable을 모른다) | any 어법 = 좌하단 |

★ **좌하단 정렬을 maskable에 쓰면 잘린다.** maskable 안전영역은 캔버스 중앙 지름
410px인데 좌하단 배치는 그 밖으로 크게 나간다. 아트보드도 안전영역 원을
**정중앙 버전에만** 겹쳐 그렸다.

내보낸 뒤 **실제로 원형·둥근사각 마스크를 씌워 "N"이 잘리지 않는지 확인한다.**

`scripts/make-icons.mjs`는 픽셀아트 전용이라 재사용할 수 없다. 새로 쓰거나 갈아엎어라.
**외부 이미지 라이브러리를 추가하지 않는다** — 의존성 추가 금지가 살아 있다.
기존 스크립트가 `zlib`만으로 PNG를 인코드하는 방법을 보여 준다.
글리프 래스터라이즈가 필요하다는 것이 새 문제다.

### B7-3. 동작 없는 컨트롤 4개 — **사용자 결정 대기 중**

| 위치 | 지금 |
|---|---|
| `app/company/page.tsx:47` | 우상단 `설정` — "동작 미정. 자리만 잡는다" |
| `app/company/page.tsx:183` | `맞춤 분석 다시 실행` — "동작 미정" |
| `app/laws/[id]/page.tsx:56` | 우상단 `저장` — "TODO 6단계" |
| `app/map/page.tsx:299` | `국가 검색` — 비기능 |

3차에서 제안한 안(**사용자 승인 전이다. 먼저 확인하라**):

> `설정` · `맞춤 분석 다시 실행` · `국가 검색` 셋은 **지운다.** 눌러도 아무 일 없는
> 컨트롤이 넷이면 프로토타입으로 읽힌다.
> `저장`만 **살린다** — `lib/persistentIdSet.ts`가 이미 있어 `neo.laws.saved` 하나
> 추가하면 끝이고, S2 필터에 `저장됨`을 붙이면 그때부터 실기능이다.

---

## 4. B8 — 심사 대응 `아직 0건 검증`

- [ ] `next build` 무경고 통과 · `tsc --noEmit` 통과 — **지금 통과 중이나 B6 후 재확인**
- [ ] Lighthouse: PWA 설치 가능, **접근성 90 이상**
- [ ] **오프라인**: 네트워크 차단 상태에서 6화면 + `/setup` 전부 열린다.
      16개 법령 파일과 `countries-110m.json`이 전부 캐시되는지 (CDN 의존 0건).
      `components/ServiceWorker.tsx`가 `allLaws`에서 라우트를 만들어 자동으로 따라가지만
      **실제로 캐시되는지는 확인해야 한다.** 지금 법령 14건 → B6 완료 시 40~60건
- [ ] **터치 타겟 최소 44px** — 탭바, 목록 행, 체크박스, `/setup` 선택 행,
      S4의 `×` 버튼(지금 20px 폭이다 — **확인 필요**)
- [ ] **색 대비 실측** — 위험도 색면 위 `--on-color`, `--text-3 #6B6B6B` on `--bg #171717`.
      후자는 본문에 쓰기엔 대비가 낮다. **`--text-3`이 23개 파일 63곳에 쓰인다** —
      Meta·비활성 라벨 밖에서 본문에 쓰인 곳을 골라내 보고한다
- [ ] **상태 화면 전수**: 프로필 없음 / 조합 데이터 없음 / 필터 결과 0 / 로딩 / 에러 / 오프라인
- [ ] `README.md`에 데이터 출처 정책과 지원 범위(4×3) 명시.
      **"실시간 법령 수집이 아니라 수동 검증된 데이터셋"이라는 사실을 숨기지 않는다.**
      이걸 명시하는 쪽이 심사에서 강하다
- [ ] 금지 규칙 전수: `box-shadow` 0 / `border-radius`는 체크박스만 / 이모지 0 / 중앙정렬 0
      — 구조는 이미 맞다. `app/globals.css:177`이 `* { box-shadow: none; border-radius: 0 }`로
      전역 강제하고 `:178`이 `.is-checkbox`만 예외로 둔다. **실측만 남았다**

---

## 5. B9 — 배포 + 실기기 확인

배포 URL: <https://neo-tau-six.vercel.app/> (GitHub `main` 푸시로 자동 배포)
**푸시하면 곧 배포다.** 빌드가 통과하는 상태에서만 푸시한다.

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
**이미 3000 포트에 dev 서버가 떠 있을 수 있다** — `launch.json`의 `autoPort`가
다른 포트를 잡으면 Next가 "Another next dev server is already running"으로 죽는다.
그때는 `preview_start({url: "http://localhost:3000/setup"})`로 기존 서버에 붙어라.

**프로필 주입** — `/setup`을 매번 타지 않고 조합을 바꾸는 법:

```js
// 반드시 앱 오리진에서 실행한다. about:blank에서는 localStorage가 막힌다
localStorage.setItem('neo.profile', JSON.stringify({
  companyName: '한빛전자', originCountry: 'KR', destinationCountry: 'VN',
  itemCategory: 'electronics',
  products: [{ id: 'p-elec-1', name: '무선 이어폰', hsCode: '8518.30' }],
  updatedAt: new Date().toISOString(),
}));
```

**실기기 기하 재현법** — `env()`는 브라우저에서 0이라 이렇게 흉내 낸다:

```js
document.documentElement.style.setProperty('--safe-top', '59px');
document.documentElement.style.setProperty('--safe-bottom', '34px');
```

뷰포트는 402×874(iPhone 16 Pro)로 두고 잰다. 375(SE)와 1400(데스크톱)도 확인한다.

---

## 7. 시작 전에 확인할 것

1. `npm run check-data`가 통과하는가 — **조합 16 · 법령 14 · 액션 39 · 1차 4 / 2차 10**이
   나와야 한다. 다르면 누가 데이터를 건드린 것이니 먼저 `git log`를 본다
2. 웹 검색·URL 열람이 가능한가. **B6는 이게 없으면 진행할 수 없다.**
   불가능하면 B7부터 하고 보고한다
3. `design/NEO Setup v4.dc.html`이 리포에 있는가 (B7-2에서 IC를 실측한다)
4. `docs/DATA-SOURCES.md`의 **「VN — 전기·전자」 절**을 읽었는가.
   **B6는 그 절을 10번 더 쓰는 일이다**

---

## 8. 순서와 열려 있는 결정

권장 순서: **`2-a`(VN 마무리) → `2-b~2-j`(9조합) → B7 → B8 → B9**

B8은 B6가 끝나야 의미가 있다 — 오프라인 캐시·빌드·상태 화면이 전부 데이터 양에 걸린다.
B7-2(아이콘)·B7-3(정리)은 데이터와 무관해 B6 중간에 끼워 넣어도 된다.

**사용자에게 먼저 물을 것 둘:**

1. **B7-3** — 위 제안(`설정`·`맞춤 분석`·`국가 검색` 삭제 / `저장`만 구현)대로 갈지,
   넷 다 지울지
2. **작업 순서** — `2-a`부터 이어갈지, 아이콘·정리를 먼저 털지

애매하면 임의로 정하지 말고 먼저 질문한다. 각 단계 검증이 통과해야 다음으로 간다.
실패하면 넘어가지 말고 멈춰서 보고한다.

**한 조합을 완성할 때마다 멈추고 보고한다.**
