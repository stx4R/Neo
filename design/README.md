# design/

Claude Design 확정 산출물. **구현 시 값이 헷갈리면 여기가 최종 진실이다.**

| 파일 | 내용 |
|---|---|
| `NEO-screens.dc.html` | 6화면 원본. 인라인 스타일에 실측값이 그대로 들어 있다 |
| `neo-dots.js` | 모노크롬 도트 지오그래피 렌더러. **포팅 대상** |
| `support.js` | Claude Design 런타임. 참고용, 포팅하지 않는다 |
| `screens.png` | 6화면 렌더. 구현 결과 대조용 |

## NEO-screens.dc.html 읽는 법

Claude Design 포맷이라 `<x-dc>`, `<helmet>`, `<sc-if>`, `{{ }}` 바인딩이 섞여 있다.
브라우저로 그냥 열면 렌더되지 않는다. **값을 읽는 용도로만 쓴다** — 인라인 `style` 속성이 곧 스펙이다.

값 추출 예:

```bash
grep -oE '#[0-9A-F]{6}' 'NEO-screens.dc.html' | sort | uniq -c | sort -rn
grep -oE 'font:[^;"]+' 'NEO-screens.dc.html' | sort | uniq -c | sort -rn
```

## neo-dots.js 포팅

두 모드가 있다. `mode="globe"`(정사도법) → S1, `mode="asia"`(평면) → S5.

현재 런타임에 CDN에서 받아온다:

```
unpkg.com/d3@7.9.0/dist/d3.min.js
unpkg.com/topojson-client@3.1.0/...
cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json
```

**오프라인 PWA에서 이건 치명적이다.** 포팅 시:

1. `d3-geo`만 npm 설치 (d3 전체 아님 — 약 30KB)
2. `topojson-client` npm 설치
3. `countries-110m.json`을 `public/geo/`에 정적 파일로 포함 (약 110KB)
4. canvas 로직을 React 컴포넌트로 감싸 `useEffect` + `ref` 처리

검증: **네트워크를 끊은 상태에서 지구본과 지도가 그려져야 한다.**
