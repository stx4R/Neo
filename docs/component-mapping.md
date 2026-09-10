# NEO — 컴포넌트 매핑

4개 라이브러리를 실제로 열어 컴포넌트 목록을 확인하고, NEO 6화면 요소에 매핑했다.

---

## 0. 먼저 정정할 것

**Claude Design은 링크를 받아 컴포넌트를 끌어오지 못한다.** Claude Design은 시각 디자인을 생성하는 도구이고, npm 패키지를 설치하거나 React 컴포넌트를 import하지 않는다. `https://magicui.design/...` 링크를 붙여넣어도 그 컴포넌트가 들어오지 않는다.

**대신 이렇게 쓴다.** 각 화면 요소에 쓸 컴포넌트를 지금 확정하고, 그 **시각적 거동을 프롬프트에 말로 박아 넣는다.**

> "지구본 아래 대륙이 촘촘한 점으로 표현되고, 마커에서 호(arc)가 뻗어나가는 cobe 스타일"

이러면 두 가지가 동시에 해결된다.

1. Claude Design이 그 컴포넌트의 시각 언어로 디자인을 뽑는다
2. **4단계에서 그 컴포넌트를 그대로 설치하면 디자인과 코드가 일치한다**

디자인 단계에서 컴포넌트를 확정하지 않으면, 예쁘지만 구현 불가능한 화면이 나오고 4단계에서 전부 다시 그리게 된다. 이 매핑이 그걸 막는다.

---

## 1. 채택 컴포넌트

| 화면 | 요소 | 라이브러리 | 컴포넌트 | 링크 |
|---|---|---|---|---|
| S1 | **지구본** | Magic UI | `Globe` | https://magicui.design/docs/components/globe |
| S1 | 긴급 카드 테두리 | Magic UI | `Border Beam` | https://magicui.design/docs/components/border-beam |
| S1·S3 | D-Day 숫자 | Magic UI | `Number Ticker` | https://magicui.design/docs/components/number-ticker |
| S1 | 진입 애니메이션 | Magic UI | `Blur Fade` | https://magicui.design/docs/components/blur-fade |
| S1 | 배경 텍스처(선택) | React Bits | `Radar` / `Grid Scan` | https://reactbits.dev/backgrounds/radar |
| S2 | 카드 선택 글로우 | Aceternity | `Glowing Effect` | https://ui.aceternity.com/components/glowing-effect |
| S3 | 히어로 스포트라이트 | Aceternity | `Spotlight` | https://ui.aceternity.com/components/spotlight |
| S4 | Priorities 2×2 | Magic UI | `Bento Grid` | https://magicui.design/docs/components/bento-grid |
| S4 | 카드 호버 | Magic UI | `Magic Card` | https://magicui.design/docs/components/magic-card |
| S5 | **점 지도 + 항로** | Aceternity | `World Map` | https://ui.aceternity.com/components/world-map |
| S5 | (대안) 점 지도 | Magic UI | `Dotted Map` | https://magicui.design/docs/components/dotted-map |
| S6 | 알림 순차 등장 | Magic UI | `Animated List` | https://magicui.design/docs/components/animated-list |
| 전역 | 바텀시트 | shadcn | `Drawer` (vaul) | — |

### 핵심 발견 3가지

**① Magic UI `Globe`는 cobe 기반이다.** PRD가 "three.js 금지, canvas 경량 구현"으로 제약했던 그 지구본이 정확히 이것이다. 약 30KB. 마커와 호(arc)를 좌표로 지정할 수 있어 한국→베트남 항로가 그대로 구현된다. **S1의 핵심 요소가 이미 해결돼 있다.**

**② Aceternity `World Map`은 SVG다.** "점으로 된 세계지도 + 애니메이션 라인과 도트, 프로그램으로 생성"— S5 Map 명세와 거의 1:1이다. 지도 타일을 받아올 필요가 없어 오프라인에서도 동작한다. PWA에 이상적이다.

**③ 지금 연결된 Magic UI 하나가 고가치 항목을 거의 다 덮는다.** Globe, Dotted Map, Animated Beam, Animated List, Number Ticker, Bento Grid. React Bits와 Aceternity를 끝내 못 붙여도 핵심 경로는 막히지 않는다.

---

## 2. 금지 컴포넌트

| 컴포넌트 | 이유 |
|---|---|
| Aceternity `GitHub Globe`, `3D Globe` | **three.js 의존.** 수백 KB. PRD의 PWA 번들 제약 위반. Magic UI `Globe`로 대체 |
| React Bits `lanyard`, `model-viewer` | three.js 의존 |
| React Bits 텍스트 이펙트 전체 (`Glitch Text`, `Decrypted Text`, `Scrambled Text`, `Fuzzy Text` 등) | 법령명이 흔들리거나 깨져 보이면 **신뢰가 무너진다.** 규제 앱에서 가장 하면 안 되는 것 |
| `Meteors`, `Confetti`, `Aurora`, `Particles`, `Prismatic Burst` | 랜딩페이지 장식. 업무용 앱의 정보 밀도를 해친다 |
| 커서 계열 전부 (`Glow Cursor`, `Swarm Cursor`, `Target Cursor`) | 모바일에 커서가 없다 |

**원칙**: 이건 마케팅 사이트가 아니라 통관 사고를 막는 업무용 앱이다. 화려함이 아니라 **읽히는 속도**가 품질이다. 모션은 상태 변화를 알릴 때만 쓴다.

---

## 3. 번들 예산 (4단계 제약)

- WebGL 배경(React Bits `Radar` 등)은 **전체에서 최대 1개, Home에만**. 두 개 이상이면 저사양 안드로이드에서 프레임이 무너진다
- `Globe`(cobe)와 WebGL 배경을 **같은 화면에 겹치지 않는다**. 지구본이 우선이므로 배경 텍스처는 정적 CSS 격자로 대체 가능
- `World Map`은 SVG라 예산에 거의 잡히지 않는다 — 지도는 이쪽으로 간다
- 목표: 초기 JS 200KB gzip 이내

---

## 4. 4단계 설치 (프로젝트 스캐폴드 후)

```bash
npx create-next-app@latest neo --typescript --tailwind --app
cd neo
npx shadcn@latest init
```

`components.json`에 레지스트리 3개 등록:

```json
{
  "registries": {
    "@magicui":    "https://magicui.design/r/{name}.json",
    "@react-bits": "https://reactbits.dev/r/{name}.json",
    "@aceternity": "https://ui.aceternity.com/registry/{name}.json"
  }
}
```

```bash
npx shadcn@latest mcp init --client claude
```

이 한 줄로 **React Bits와 Aceternity MCP가 동시에 붙는다.** 그 뒤 설치:

```bash
npx shadcn@latest add @magicui/globe @magicui/number-ticker @magicui/border-beam \
  @magicui/animated-list @magicui/bento-grid @magicui/magic-card @magicui/blur-fade
npx shadcn@latest add @aceternity/world-map @aceternity/glowing-effect @aceternity/spotlight
npx shadcn@latest add drawer checkbox
```

---

# v3 개정 — 디자인 톤 교체에 따른 재검토

디자인 시스템이 "다크 + 시안 글로우"에서 **stx4r.me 편집디자인 톤(#171717 중성 진회색, 색면, 직각, 글로우 없음)** 으로 바뀌면서 채택 목록이 달라졌다.

## 탈락 — 전부 글로우 기반이라 새 규칙과 정면 충돌

| 컴포넌트 | 사유 |
|---|---|
| Magic UI `Border Beam` | 테두리를 도는 발광. 글로우 금지 규칙 위반 |
| Aceternity `Spotlight` | 원뿔형 발광. 평면 규칙 위반 |
| Aceternity `Glowing Effect` | 이름 그대로 글로우 |
| Magic UI `Magic Card` | 커서 추적 radial 광원 |

이 넷은 v2 톤에서는 정확한 선택이었지만, 새 톤에서는 **넣는 순간 다시 AI처럼 보인다.** 대체물은 필요 없다 — 강조는 색면과 타이포 무게가 담당한다.

## 유지

| 화면 | 요소 | 컴포넌트 | 조건 |
|---|---|---|---|
| S1 | 지구본 | Magic UI `Globe` | **흑백으로 강제.** 마커 색 제거, 글로우 파라미터 0, 도착지만 빨강 |
| S5 | 점지도 | Aceternity `World Map` | 점 색 `#3A3A3A`, 항로 흰 실선, 펄스 제거 |
| S1·S3 | D-Day 숫자 | Magic UI `Number Ticker` | 색면 위 검은 글씨로 얹음 |
| S6 | 알림 리스트 | Magic UI `Animated List` | 카드 대신 헤어라인 행으로 스타일 재정의 |
| 전역 | 하단 시트 | shadcn `Drawer` | **라운드 0px 강제** (기본값이 둥글다) |

## 탈락한 자리를 무엇이 대신하는가

- 강조 → **꽉 찬 색면 + 검은 글씨**
- 구분 → **1px `#2E2E2E` 헤어라인**
- 상태 → **한자 마커 施/留/豫**
- 위계 → **Pretendard 무게(400/500/700/800)와 여백**

라이브러리 의존이 줄어 번들도 가벼워진다. 남은 것 중 무거운 건 `Globe`(cobe, ~30KB) 하나뿐이고, `World Map`은 SVG다.

## 4단계 설치 (수정)

```bash
npx shadcn@latest add @magicui/globe @magicui/number-ticker @magicui/animated-list
npx shadcn@latest add @aceternity/world-map
npx shadcn@latest add drawer checkbox
```

React Bits WebGL 배경(`radar`, `grid-scan`)도 **전부 탈락**한다 — 발광 텍스처라 새 톤과 맞지 않는다.
