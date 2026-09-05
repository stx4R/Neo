# NEO

해외 수출 규제 대응 PWA. 베트남 등 해외에 수출하지만 법률·규제 대응팀이 없는 국내 중소기업 담당자를 위한 앱.

법률 변화를 **기업별 영향**과 **실행 항목**으로 변환해, 수출 전 필요한 조치를 확인하고 완료할 수 있게 한다.

## 현재 상태

**v1.0.0.** `docs/build-plan.md` §10의 12단계 전부 완료. 6화면과 상태 화면 5종이 동작한다.

| | |
|---|---|
| 화면 | Home / Laws / Law Detail / Company / Map / Notifications |
| 상태 화면 | 빈 상태 · 스켈레톤 · 에러 · not-found · 오프라인 바 |
| 스택 | Next.js App Router + TypeScript + Tailwind |
| 데이터 | 정적 JSON + localStorage. 백엔드 없음 |
| 지오그래피 | `design/neo-dots.js`를 `d3-geo` + `topojson-client`로 포팅. CDN 의존 0 |
| PWA | 손으로 쓴 `public/sw.js`. Serwist·next-pwa 쓰지 않는다 |
| 기준 날짜 | `data/meta.json`의 `2026-09-03`. `new Date()`를 쓰지 않는다 |

계획서(`docs/build-plan.md`)는 스택에 shadcn을 적었지만 의존성에 들어 있지 않다.
런타임 의존성은 `next` · `react` · `react-dom` · `d3-geo` · `topojson-client` 다섯뿐이고
컴포넌트는 전부 직접 썼다. 하단 시트에 vaul을 쓰지 않기로 한 경위는
`docs/DISCREPANCIES.md` §14에 있다.

### 알려진 한계 — 오프라인

라우트 문서와 RSC 페이로드는 10개 전부 프리캐시되지만, **라우트별 JS 청크는 담기지
않는다.** 첫 방문의 청크 요청이 서비스워커가 제어권을 잡기 전에 끝나기 때문이다.
그래서 설치 직후 오프라인에서는 페이지가 프리렌더 HTML로 열리기만 하고 하이드레이션이
되지 않는다 — 체크박스·필터·지도 마커가 동작하지 않는다. 온라인에서 한 번씩 방문한
라우트는 청크가 런타임 캐시에 들어가 오프라인에서도 정상 동작한다.

고치려면 프리캐시 목록에 청크 URL을 더해야 한다. 범위 밖으로 두기로 한 항목이고,
경위와 대안은 `docs/DISCREPANCIES.md`의 12단계 판정에 적혀 있다.

## 시작하기

```bash
npm install
npm run dev
```

`CLAUDE.md`의 디자인 절대 규칙 9개가 다른 모든 문서보다 우선한다.

```
docs/     명세 문서 + 판정 기록(DISCREPANCIES.md)
design/   6화면 시각 원본 · 포팅 전 지오그래피 원본 · 아이콘 원본
scripts/  아이콘·마커 글꼴 생성기 (재생성할 때만 돌린다)
```

## 샘플 데이터

실제 베트남 식품 규제 5건 기반. 법령 번호·시행일·핵심 변경사항은 실제 기준이며, 절차상 세부 기한은 프로토타입 표현용이다.

- Decree 37/2026/ND-CP — 식품 라벨 표시 (2026.01.23 시행)
- Decree 110/2026/ND-CP — 생산자책임재활용 EPR (2026.05.25 시행)
- Circular 29/2023/TT-BYT — 영양성분 표시 (2026.01.01 의무)
- Decree 46/2026/ND-CP — 식품안전법 시행령 (2026.04.06 시행 보류)
- Decree 15/2018/ND-CP — 자가공표 절차 (현행 유지)
