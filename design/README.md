# design/

Claude Design 확정 산출물. **구현 시 값이 헷갈리면 여기가 최종 진실이다.**

| 파일 | 내용 |
|---|---|
| `NEO Toss Reform.dc.html` | 시각 원본. 01 토큰 · 02 부품 · 03 화면 8장(S1~S6, 셋업 2/4 · 4/4) · 04 다크. 인라인 스타일에 실측값이 그대로 들어 있다 |
| `support.js` | Claude Design 런타임. 참고용, 포팅하지 않는다 |
| `neo-dots.js` | 모노크롬 도트 지오그래피 렌더러. `components/DotGeo.tsx`로 포팅했다 |
| `neo-geo.js` | 같은 렌더러의 앞선 판. 참고용 |

이전 디자인(다크 단일 · 무라운드 · 한자 마커)의 원본 — `NEO-screens.dc.html`, `NEO Setup v4.dc.html`,
`screens.png`, `mobile.png` — 은 지웠다. git 이력에 남아 있다.

## NEO Toss Reform.dc.html 읽는 법

Claude Design 포맷이라 `<x-dc>`, `<helmet>`, `{{ }}` 바인딩이 섞여 있다.
브라우저로 그냥 열면 렌더되지 않는다. **값을 읽는 용도로만 쓴다** — 인라인 `style` 속성이 곧 스펙이다.

토큰은 맨 위 `<style>`의 `:root`(라이트)와 `[data-theme="dark"]`(다크)에 있다.
앱에서는 `app/globals.css`가 같은 이름으로 옮겨 두었고, 다크는 `prefers-color-scheme`으로 붙는다.

값 추출 예:

```bash
grep -oE 'oklch\([^)]+\)' 'NEO Toss Reform.dc.html' | sort | uniq -c | sort -rn
grep -oE 'font:[^;"]+' 'NEO Toss Reform.dc.html' | sort | uniq -c | sort -rn
```

## 목업과 앱이 다른 곳

일부러 다르게 둔 것들이다. 되돌리기 전에 이유를 먼저 본다.

| 자리 | 목업 | 앱 | 이유 |
|---|---|---|---|
| 상태바 | `9:41` 가짜 상태바 | 기기 상태바 | 없는 상태바를 흉내 내지 않는다 |
| S1 지구본 · S5 지도 | 빗금 자리표시 | 실제 DotGeo | 자리표시다 |
| 숫자 (D-433, 12/17 …) | 예시 값 | `lib/derive.ts` 파생값 | 숫자를 박으면 체크 한 번에 거짓말이 된다 |
| S1 할 일 목록 | 3행 + `2건 더 보기` | 같다. `전체보기`와 `N건 더 보기`는 둘 다 제자리에서 편다 | 할 일 전체를 보여 줄 별도 화면이 없다 |
| S2 · S5 우상단 필터 아이콘 | 있음 | 없음 | 열 화면이 없다. 필터는 칩과 검색이 한다 |
| S2 목록 배지 | 행마다 위험도·D-Day·상태가 섞임 | `lawBadge` 규칙 하나 | 카운트다운 → 없으면 `미이행` · 보류는 `보류` · 할 일 없으면 `시행중` |
| S5 다른 지원 국가 점 | 위험도 색 | 중립색 | 데이터셋이 도착국 하나의 법령만 든다 |
| S5 초기화 경고 | 시트 하단에 늘 있음 | 다른 국가 마커를 눌렀을 때만, [취소][바꾸기]와 함께 시트 맨 위 | 누르기 전에는 할 말이 아니고, 눌렀으면 바로 보여야 한다 |
| S6 두 번째 묶음 | `지난 주` | `이전` | 그 묶음에 한 달 전 알림도 들어온다 |
| S6 알림 켜기 카드 | 늘 있음 | 권한을 아직 안 정한 기기에서만 | 닫기(×)가 없는 카드로 이미 정한 권한을 다시 권하지 않는다 |
| S8 제품 행 | 이름 · HS | 이름 · HS · × | 지울 길이 없으면 기본 제품을 뺄 수 없다 |
| 탭바 · CTA 아래 여백 | 바닥에서 20 | `max(20px, 홈 인디케이터)` | 인디케이터 위에 올라앉지 않는다 |

## neo-dots.js 포팅

두 모드가 있다. `mode="globe"`(정사도법) → S1, `mode="asia"`(평면) → S5.

원본은 런타임에 CDN에서 받아온다:

```
unpkg.com/d3@7.9.0/dist/d3.min.js
unpkg.com/topojson-client@3.1.0/...
cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json
```

**오프라인 PWA에서 이건 치명적이다.** 포팅에서 전부 걷어냈다:

1. `d3-geo`만 npm 설치 (d3 전체 아님)
2. `topojson-client` npm 설치
3. 지리 데이터를 `public/geo/`에 정적 파일로 포함
4. canvas 로직을 React 컴포넌트로 감싸 `useEffect` + `ref` 처리

검증: **네트워크를 끊은 상태에서 지구본과 지도가 그려져야 한다.**
