# NEO 앱 V6 — PRD v2

> v1 대비 변경: IA 역할 분리, 실행 항목(Actions) 도입, 알림·검색 추가, 위험도/제품 데이터 모델 정의, 디자인 토큰 명세, 상태 정의, PWA 요구사항, 측정 가능한 성공 기준.

---

## 1. 목적

복잡한 해외 법률 변화를 **기업별 영향**과 **실행 항목**으로 변환하여, 수출 전 필요한 조치를 빠르게 확인·완료할 수 있게 한다.

핵심 명제: **"이 법이 바뀌었다"가 아니라 "그래서 당신은 이걸 해야 한다"를 판다.**

## 2. 핵심 사용자

베트남 등 해외시장에 수출하지만 별도의 법률·규제 대응팀을 갖추기 어려운 국내 중소기업의 수출·품질 담당자.

- 법률 전문가가 아니다 → 조문 해석이 아니라 할 일 목록이 필요하다
- 겸직 상태다 → 앱을 오래 들여다볼 시간이 없다
- 실수의 대가가 크다 → 통관 거부, 리콜, 과징금

## 3. 성공 기준 (V6에서 검증할 것)

| # | 기준 | 측정 |
|---|---|---|
| SC-1 | 신규 사용자가 온보딩 후 **60초 내** 자사 영향 법률 1건 + 그에 따른 액션 1건에 도달 | 사용자 테스트 5인 |
| SC-2 | Home → 액션 완료까지 **최대 3탭** | 화면 흐름 카운트 |
| SC-3 | 6개 화면 전체에서 위험도 색·D-Day 칩·법령 코드 표기 **100% 동일** | 디자인 대조 |
| SC-4 | 모든 목록형 화면에 빈 상태·로딩 상태가 존재 | 화면 체크리스트 |

**V6 = 프로토타입 버전 라벨.** 실제 법률 분석 엔진은 범위 밖이며, 화면과 흐름의 정합성만 검증한다.

## 4. 정보 구조

### 4.1 하단 탭 (4개 유지)

`Home / Laws / Company / Map`

### 4.2 Home과 Map의 역할 분리 (v1 중복 해소)

| | Home 지구본 | Map |
|---|---|---|
| 성격 | **요약형 시각화** (인터랙션 없음) | **탐색 도구** (인터랙션 중심) |
| 내용 | 현재 수출 경로 1개 + 도착지 위험 배지 | 전 국가 마커, 필터, 국가별 상세 |
| 동작 | 탭하면 Map으로 이동 | 국가 선택 → 바텀시트 |
| 목적 | "우리 항로에 문제가 있다"는 인상 | "어느 나라가 어떤 상태인지" 비교 |

### 4.3 실행 항목(Actions)의 위치 — 별도 탭 없음

- **Home**: `지금 해야 할 일 N건` 요약 섹션 (상위 3개 + 전체 보기)
- **Law Detail**: 해당 법령의 액션 체크리스트 (화면 **최상단**, 조문 요약보다 위)
- 액션 완료 상태는 두 곳에 동기화되어 표시된다

### 4.4 화면 목록 (V6 산출 범위 = 6화면)

| ID | 화면 | 진입 |
|---|---|---|
| S1 | Home | 탭 1 |
| S2 | Laws (목록) | 탭 2 |
| S3 | Law Detail | S1/S2/S5 카드 탭 |
| S4 | Company | 탭 3 |
| S5 | Map | 탭 4, S1 지구본 탭 |
| S6 | Notifications | S1 헤더 벨 |

범위 밖(2차): 온보딩 3단계, 제품 등록/편집, 액션 완료 세부 플로우.

## 5. 데이터 모델

### 5.1 Law

```
id            VN-2026-037
title         식품 라벨 표시 규정 전면 개정
officialRef   Decree 37/2026/ND-CP
country       VN
category      labeling | safety | packaging | customs   ← Company Priority와 매칭 키
status        active | pending | suspended | monitoring
effectiveDate 2026-01-23
deadline      2028-01-22            (경과규정 종료일, 있을 때만)
riskLevel     critical | high | medium | low
summary       1~2문장
changes       [{ before, after }]
affectedProducts [productId]
actions       [Action]
source        { url, publisher, originalLang, lastVerified }
```

### 5.2 위험도 (v1 미정의 → 확정)

3축 곱으로 산정하되 **UI에는 4단계 라벨만 노출**한다.

`위험도 = 제재 강도 × 대응 시급성(D-Day) × 자사 제품 해당 범위`

| 라벨 | 색 토큰 | 의미 |
|---|---|---|
| Critical | `risk.critical` `#FF4D6A` | 통관 거부·리콜 가능. 즉시 조치 |
| High | `risk.high` `#FF8A3D` | 기한 내 미조치 시 판매 불가 |
| Medium | `risk.medium` `#FFC53D` | 준비 필요, 여유 있음 |
| Low | `risk.low` `#34D399` | 인지만 하면 됨 |
| (상태) 시행 보류 | `status.monitoring` `#818CF8` | 확정 전, 모니터링 대상 |

### 5.3 Product (v1 암시 → 1급 객체로 승격)

```
id, name, hsCode, category, impactedLawCount, impactLevel
```
HS코드가 법률-제품 매칭의 실제 키다. 프로토타입에서도 카드에 노출한다.

### 5.4 Action

```
id, lawId, title, owner(추천 부서), estimatedEffort, dueDate, done
```

### 5.5 CompanyPriority = **관심 규제 영역**

사용자가 선택한 규제 카테고리. `Law.category`와 직접 매칭되어 Laws 목록의 기본 필터·정렬 기준이 된다.

```
id, name, icon, matchedLawCount, openActionCount, maxRiskLevel
```

## 6. 디자인 시스템

### 6.1 톤

**다크 + 시안 글로우.** 관제실(mission control) 은유 — 밤에 항로를 감시하는 화면. 지구본과 항로가 발광하고, 위험도 색이 어두운 배경 위에서 최대 대비를 얻는다.

### 6.2 컬러 토큰

```
bg.base        #070B14   화면 배경
bg.surface     #0E1626   카드
bg.elevated    #162034   바텀시트, 모달
border.subtle  #1E2B45   1px 구분선
text.primary   #E8EEF9
text.secondary #94A3B8
text.tertiary  #5A6B85
accent.primary #22D3EE   시안 — 항로, 활성 상태, 링크
accent.glow    rgba(34,211,238,0.35)
accent.route   #6366F1   인디고 — 보조 항로
risk.critical  #FF4D6A
risk.high      #FF8A3D
risk.medium    #FFC53D
risk.low       #34D399
status.monitoring #818CF8
```

**규칙**: 위험도 색은 오직 위험도 표현에만 쓴다. 시안은 상태·강조에만 쓴다. 두 계열을 섞지 않는다.

### 6.3 타이포그래피

Pretendard (한글) / Inter (영문·숫자) fallback

```
Display   28 / 34  Bold      화면 대표 제목
H1        22 / 28  Bold      섹션 대제목
H2        18 / 24  SemiBold  카드 제목
Body      15 / 22  Regular   본문
BodySm    13 / 18  Regular   보조 설명
Caption   11 / 14  Medium    +2% 자간, 대문자 — 법령 코드, 라벨
```
D-Day·날짜·HS코드는 **tabular-nums** 고정폭.

### 6.4 레이아웃

```
기준 기기   390 × 844 (iPhone 14/15)
Safe area  상단 44 / 하단 34
좌우 패딩  20
그리드     4pt
카드 라운드 16 / 칩 999 / 바텀시트 상단 24
탭바 높이  64 + safe area
글로우     0 0 40px rgba(34,211,238,0.12)
```

### 6.5 반복 컴포넌트 (전 화면 동일)

- **RiskBar** — 카드 좌측 4px 세로 바, 위험도 색
- **DDayChip** — `D-14` 캡션 칩. D-7 이하는 `risk.critical` 배경, 이후는 surface + 색 테두리
- **LawCode** — `DECREE 37/2026` 형태 Caption, `text.tertiary`
- **CountryChip** — 국기 이모지 + 국가명
- **StatusBadge** — 시행 보류 등 상태. 점선 테두리
- **GlobeMini / GlobeFull** — canvas 기반 경량 와이어프레임 지구본 (구현 시 `cobe` 수준. three.js 금지 — PWA 용량)

## 7. 화면 명세

### S1. Home

```
[상태바 44]
[헤더]  안녕하세요, 김수출 님          [🔔 배지3]
        한맛식품 · 🇻🇳 베트남
        마지막 업데이트 09.03 08:12          ← Caption, tertiary
[히어로] GlobeMini 320×320
         다크 배경 위 시안 와이어프레임 지구본
         한국 → 베트남 곡선 항로(시안 글로우, 진행 방향 화살표)
         도착지에 펄스 링 도트
         지구본 하단 오버레이 칩: "베트남 · 위험 2건"
         (탭 → S5 Map)
[긴급]   좌측 risk.critical 바 카드
         "EPR 재활용 계획 등록"  D-14
         "포장재 전 품목 해당 · 지금 확인 →"
[섹션]   지금 해야 할 일 3건            전체 보기 →
         ☐ 라벨 시안 재설계 (원산지 영문표기)   DECREE 37/2026   D-45
         ☐ 포장재 중량 산정 자료 제출           DECREE 110/2026  D-14
         ☐ 영양성분 시험성적서 확보             CIRCULAR 29/2023 기한 경과 ⚠
[섹션]   이번 주 규제 변화              (가로 스크롤 카드 3장)
         각 카드: RiskBar / LawCode / 제목 2줄 / 시행일 / 영향 제품 N개
[탭바]
```

### S2. Laws (목록)

```
[헤더]  법률                              [🔍]
[검색]  탭하면 확장되는 검색 필드 (플레이스홀더: "법령명, 제품, 키워드")
[필터칩] 가로 스크롤 · 선택 시 시안 채움
        [내 우선순위 ●] [전체] [🇻🇳 베트남] [High↑] [시행 임박]
[정렬]  세그먼트 컨트롤  [시행일순] [위험도순]
[리스트] LawCard × 5
        ┌─┬──────────────────────────────┐
        │█│ DECREE 37/2026               │  ← RiskBar + LawCode
        │█│ 식품 라벨 표시 규정 전면 개정  │  ← H2, 2줄 말줄임
        │█│ 🇻🇳 2026.01.23 시행   [D-45]  │
        │█│ 영향 제품 ●●●● +1   액션 4건 │
        └─┴──────────────────────────────┘
        시행 보류 카드는 점선 테두리 + StatusBadge "시행 보류"
[여백]  탭바 가림 방지 하단 80
```

### S3. Law Detail — **행동이 요약보다 위에 온다**

```
[히어로] 위험도 색 → 투명 그라데이션 배경
        DECREE 37/2026
        식품 라벨 표시 규정 전면 개정
        🇻🇳 베트남 · 2026.01.23 시행 · [D-45]
        경과규정: 기존 인쇄 포장재 2028.01.22까지 소진 허용

[① 해야 할 일]  ← 기본 펼침, 최상단
        ☐ 라벨 시안에 원산지 영문표기 반영     품질팀 · 2주 · ~10.15
        ☐ 최소 글꼴 0.9mm 이상 확인            디자인 · 3일
        ☐ 영양성분표 삽입 (Circular 29 연계)   품질팀 · 4주
        ☐ 구포장 재고 소진 계획 수립           영업 · 1주

[② 무엇이 바뀌었나]
        Before / After 대비 블록
        좌: 회색 취소선   우: 시안 강조
        예) 원산지 표기 — "Vietnamese only" → "영문 허용: Origin, Made in, Product of"

[③ 영향받는 제품]
        가로 스크롤 제품 카드
        김치양념 소스  HS 2103.90  영향 높음
        조미김        HS 2008.99  영향 높음
        고추장        HS 2103.90  영향 중간

[④ 출처]
        언어 토글  [원문 VN] [번역 KO]
        관보 링크 카드 (발행처, 발행일)
        신뢰 배지: "최종 확인 2026.09.01"

[고정 CTA] 하단 고정 바 — "액션 4건 담기"
```

### S4. Company

```
[회사 카드]  로고 자리 / 한맛식품 / 식품·음료(조미료·소스)
            🇻🇳 베트남  +2개국 예정
            주요 HS  2103.90 · 2008.99 · 2007.99

[관심 규제 영역]                            섹션 제목 H1
   ┌────────────┐ ┌────────────┐
   │ 🏷          │ │ 🛡          │
   │ 라벨링·표시  │ │ 식품안전·인증│
   │ 법률 3건    │ │ 법률 2건    │
   │ 미완 액션 5 │ │ 미완 액션 2 │
   │ ▂▄█ High   │ │ ▂▄  Medium │
   └────────────┘ └────────────┘
   ┌────────────┐ ┌────────────┐
   │ ♻          │ │      +      │  ← 점선 테두리
   │ 포장·환경   │ │  영역 추가   │
   │ 법률 1건    │ │             │
   │ 미완 액션 3 │ │             │
   │ ▂▄█ High   │ │             │
   └────────────┘ └────────────┘

[내 제품]   리스트 4행 — 제품명 / HS코드 / 영향 법률 N건 / >
[하단]      "맞춤 분석 다시 실행" 보조 버튼
```

### S5. Map

```
[전체화면 다크 지도]  동아시아~동남아 중심
    한국 → 베트남 시안 글로우 호(arc), 진행 방향 파티클
    국가 마커: 위험도 색 도트 + 펄스 링 + 라벨
    🇻🇳 베트남 (활성, critical)  /  🇮🇩 🇹🇭 흐린 도트 "곧 지원"
[상단 플로팅] 검색 바 + 필터 아이콘 (반투명 블러)
[바텀시트 peek]  드래그 핸들
    🇻🇳 베트남                      위험 High
    규제 업데이트 5건 · 미완 액션 10건
    ─ DECREE 37/2026  라벨 표시 개정   [D-45]
    ─ DECREE 110/2026 EPR             [D-14]
    ─ DECREE 46/2026  식품안전 시행령  [시행 보류]
    (위로 드래그하면 전체 목록)
```

### S6. Notifications

```
[헤더]  알림                              모두 읽음
[배너]  1회성 카드 — "시행일이 다가오면 알려드릴까요?"  [알림 켜기]
        (PWA Web Push 권한 요청 트리거)
[오늘]
   ● 🔴 시행 임박   EPR 재활용 계획 등록 D-14        2시간 전
   ● 🟣 상태 변경   Decree 46/2026 시행이 보류됐습니다  6시간 전
[이번 주]
     🟠 신규 규제   Decree 37/2026 라벨 표시 개정      2일 전
     🟢 액션 완료   영양성분 시험성적서 확보           4일 전
[이전]
     ...
```

## 8. 상태 정의 (v1 누락)

| 상태 | 화면 | 표현 |
|---|---|---|
| 빈 상태 | Laws 필터 결과 0 | 시안 아웃라인 일러스트 + "조건에 맞는 법률이 없습니다" + [필터 초기화] |
| 빈 상태 | Company 우선순위 0 | + 카드만 크게 + "관심 규제 영역을 추가하면 맞춤 분석이 시작됩니다" |
| 로딩 | 모든 목록 | 카드 형태 스켈레톤 + 시안 shimmer |
| 에러 | 데이터 실패 | "규제 데이터를 불러오지 못했습니다" + [다시 시도] |
| 오프라인 | 전역 | 상단 고정 앰버 바 — "오프라인 · 09.03 08:12 기준 캐시" |

## 9. PWA 요구사항 (4단계용 · 화면 설계에 영향)

```
display        standalone
orientation    portrait
theme_color    #070B14
background     #070B14
아이콘          192 / 512 / maskable
```

- **Service Worker**: 법률 목록·상세 = stale-while-revalidate / 지도 타일 = cache-first / 정적 자산 = precache
- **Web Push**: ① 신규 규제 ② 시행일 D-7 ③ 상태 변경(시행→보류 등)
- **설치 프롬프트**: 2회차 방문 시 Home 하단 배너
- **전역 동기화 시각** 노출 (오프라인 신뢰성)
- **번들 제약**: 지구본은 canvas 기반 경량 구현. three.js 도입 금지

## 10. 샘플 데이터 (실제 베트남 규제 기반)

### 회사
한맛식품 (HANMAT FOODS) · 식품·음료(조미료·소스류) · 수출 🇻🇳 베트남

### 제품
| 제품 | HS코드 | 영향 |
|---|---|---|
| 김치양념 소스 | 2103.90 | 높음 |
| 조미김 | 2008.99 | 높음 |
| 고추장 | 2103.90 | 중간 |
| 유자청 | 2007.99 | 낮음 |

### 법률 5건

| 코드 | 법령 | 상태 | 위험도 | 핵심 |
|---|---|---|---|---|
| VN-2026-037 | **Decree 37/2026/ND-CP** 식품 라벨 표시 | 2026.01.23 시행 | High | Decree 43/2017 대체. 제조일 DD/MM/YYYY, 영양성분표 의무, 원산지 **영문 표기 허용**(Origin/Made in/Product of), 최소 글꼴 0.9mm, QR·NFC 디지털 라벨 도입. **기존 인쇄 포장재는 2028.01까지 소진 허용** |
| VN-2026-110 | **Decree 110/2026/ND-CP** 생산자책임재활용(EPR) | 2026.05.25 시행 | Critical | 2022·2025년 규정 대체. 포장재 재활용 의무 — 자체 재활용 또는 기금 분담금 |
| VN-2023-029 | **Circular 29/2023/TT-BYT** 영양성분 표시 | 2026.01.01 의무 | High | 사전포장 식품에 에너지·단백질·당류 표시 의무화. **이미 시행됨 → 미준수 리스크** |
| VN-2026-046 | **Decree 46/2026/ND-CP** 식품안전법 시행령 | 2026.01.26 시행 → **2026.04.06 보류** | Medium (모니터링) | 자가공표 폐지, 기술규정 적합성 선언 + 제3자 인증으로 전환. 수입식품 시료 검사(약 7영업일). **Resolution 15/2026/NQ-CP로 효력 정지**, 개정 식품안전법 시행 시까지 |
| VN-2018-015 | **Decree 15/2018/ND-CP** 자가공표 절차 | 현행 유효 | Low | 46호 보류로 당분간 계속 적용 |

> 절차상 세부 기한(D-14 등)은 프로토타입 표현용 값이며, 법령 번호·시행일·핵심 변경사항은 실제 기준이다.

## 11. 범위 밖 (V6)

- 실제 법률 크롤링 및 LLM 분석 파이프라인
- 로그인·계정·조직 권한
- 다국어 UI (한국어만. 법률 원문만 VN/EN 병기)
- 결제·구독
- 베트남 외 국가 실데이터

## 12. 출처

- [Vietnam Decree 46/2026/ND-CP: Key Food Safety Updates](https://vietanlaw.com/vietnam-decree-46-2026-nd-cp-key-food-safety-updates-compliance-guide/)
- [Vietnam Food Labeling 2026: Decree 37/2026/ND-CP](https://vietanlaw.com/vietnam-food-labeling-2026-comply-with-new-regulations-under-decree-37-2026-nd-cp/)
- [Vietnam: New Regulations on Extended Producer Responsibility — Baker McKenzie](https://www.bakermckenzie.com/en/insight/publications/2026/06/vietnam-new-regulations-on-extended-producer-responsibility)
- [Nutrition Labeling Compliance under Circular 29/2023 — Eurofins](https://www.eurofins.vn/en/news/knowledge-of-testing-industry/nutrition-labeling-compliance-under-circular-29/)
