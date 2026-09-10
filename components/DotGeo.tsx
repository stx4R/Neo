'use client';

import { geoMercator, geoOrthographic, geoPath, type GeoProjection } from 'd3-geo';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { loadLand } from '@/lib/geo';
import type { FeatureCollection, Geometry } from 'geojson';

/**
 * 모노크롬 도트 지오그래피. design/neo-dots.js 포팅.
 *
 * 원본은 customElements.define('neo-dots', ...) 였다. React에서는 등록 타이밍과
 * SSR이 성가시므로 그리기 로직만 순수 함수로 빼고 여기서 useEffect + ref로 부른다.
 * CDN 로더(loadScript/libs/SRI)는 전부 걷어냈다 — d3-geo와 topojson-client는
 * npm 의존성이고 지리 데이터는 public/geo/에 있다.
 *
 * 원본이 이미 제대로 하던 것은 그대로 살렸다: devicePixelRatio 상한 2,
 * ResizeObserver, requestAnimationFrame, 언마운트 정리.
 * 원본의 setInterval 폴링은 뺐다 — 커스텀 엘리먼트가 레이아웃 전에 연결되는 걸
 * 메우려던 장치인데, ResizeObserver가 관찰 시작 시 한 번 발화하므로 필요 없다.
 */

export type GeoMode = 'globe' | 'asia';

/**
 * 지리 데이터 상태. 앱에서 실제로 비동기인 것은 /geo/land-110m.json 하나뿐이라
 * 스켈레톤과 에러 자리도 이 컴포넌트 안에만 있다.
 */
type GeoState = 'loading' | 'ready' | 'error';

/** 경위도를 이 박스 안의 픽셀로 옮기는 함수. 투영 밖이면 null. */
export type Projector = (coord: [number, number]) => [number, number] | null;

/** 원본 실측값. 건드리지 말 것. */
const CFG = {
  globe: { step: 5.4, dot: 1.6, destSize: 4, bulge: 0.34 },
  asia: { step: 6.6, dot: 1.8, destSize: 6, bulge: 0.3 },
} as const;

/**
 * 항로 기본값. 프로필이 없을 때만 쓰인다 —
 * 실제 항로는 호출부가 프로필의 출발국·도착국 좌표를 넘긴다.
 * 부산 → 하이퐁. 아트보드가 그린 항로다.
 */
const FROM: [number, number] = [129.0, 35.1];
const TO: [number, number] = [105.9, 20.9];

const FLOW_PERIOD_MS = 4200;
const FLOW_COUNT = 3;
const FLOW_GAP = 0.055;
const FLOW_FADE = 0.34;
const FLOW_SIZE = 3;

/** 알파 임계값. 마스크에서 이 값 미만이면 바다로 본다. */
const LAND_ALPHA = 120;

/**
 * 스켈레톤을 띄우기 전에 기다리는 시간.
 * land는 lib/geo.ts가 모듈 레벨 Promise로 캐싱하므로 두 번째 마운트부터 즉시 끝난다.
 * 게이트가 없으면 그때마다 블록이 한 프레임 깜빡인다.
 */
const SKELETON_DELAY_MS = 250;

interface Arc {
  p0: [number, number];
  p1: [number, number];
  ctrl: [number, number];
}

interface Scene {
  bg: HTMLCanvasElement;
  /** 마커를 점 위에 얹으려면 밖에서도 같은 투영이 필요하다. */
  proj: GeoProjection;
  arc: Arc;
  width: number;
  height: number;
  dpr: number;
  routeColor: string;
}

/** `var(--x)` 를 실제 색으로 푼다. 캔버스 fillStyle은 CSS 변수를 모른다. */
function resolveColor(host: Element, value: string): string {
  const name = /^var\(\s*(--[\w-]+)\s*\)$/.exec(value);
  if (!name) return value;
  return getComputedStyle(host).getPropertyValue(name[1]).trim() || value;
}

/**
 * S5 평면지도의 기본 범위. 아트보드 값이다. 이 상자보다 좁아지지 않는다.
 * 아트보드의 세계는 KR·VN·ID·TH 넷이었다 — 그때는 이 상자가 전부를 담았다.
 */
const ASIA_BOX: [[number, number], [number, number]] = [
  [92, -12],
  [146, 47],
];

/** S1 지구본의 시점. 아트보드 값이다. */
const GLOBE_ROTATE: [number, number] = [-116, -18];

/**
 * 이 각도를 넘게 떨어진 점은 지구본 시점을 옮겨서 본다.
 * 90이 아니라 80인 것은, 가장자리에 붙은 점이 극단적으로 눌려 보이기 때문이다.
 */
const GLOBE_VISIBLE_DEG = 80;

const RAD = Math.PI / 180;

/**
 * 경도를 기준값 주위로 풀어 준다. 경도는 ±180에서 감기므로 그냥 min·max를 하면
 * 태평양을 건너는 항로가 지구 반대쪽으로 돌아가는 그림이 된다.
 * KR(129)과 US(-118.2)는 서쪽으로 247도가 아니라 동쪽으로 113도 떨어져 있다.
 */
function unwrapLng(lng: number, base: number): number {
  let d = lng - base;
  while (d > 180) d -= 360;
  while (d <= -180) d += 360;
  return base + d;
}

/** 단위 구면 위의 벡터. 두 점의 중점을 각도로 재려고 쓴다. */
function unitVec([lng, lat]: [number, number]): [number, number, number] {
  const a = lng * RAD;
  const b = lat * RAD;
  return [Math.cos(b) * Math.cos(a), Math.cos(b) * Math.sin(a), Math.sin(b)];
}

/** 두 지점 사이 각거리(도). */
function angleBetween(a: [number, number], b: [number, number]): number {
  const [x1, y1, z1] = unitVec(a);
  const [x2, y2, z2] = unitVec(b);
  return Math.acos(Math.max(-1, Math.min(1, x1 * x2 + y1 * y2 + z1 * z2))) / RAD;
}

/** 두 지점의 대권 중점. 지구본 시점을 옮길 때 쓴다. */
function midpoint(a: [number, number], b: [number, number]): [number, number] {
  const [x1, y1, z1] = unitVec(a);
  const [x2, y2, z2] = unitVec(b);
  const x = x1 + x2;
  const y = y1 + y2;
  const z = z1 + z2;
  const l = Math.hypot(x, y, z) || 1;
  return [Math.atan2(y / l, x / l) / RAD, Math.asin(z / l) / RAD];
}

/**
 * 도착국이 아트보드 상자 밖인가. 밖이면 지도가 그만큼 넓어지고 축척이 작아진다.
 * S5가 마커 밀도를 정하는 데 쓴다 — 넓어진 지도에서는 이웃 국가 라벨이 서로 겹친다.
 */
export function outsideArtboardBox(to: [number, number]): boolean {
  const base = (ASIA_BOX[0][0] + ASIA_BOX[1][0]) / 2;
  const lng = unwrapLng(to[0], base);
  return (
    lng < ASIA_BOX[0][0] ||
    lng > ASIA_BOX[1][0] ||
    to[1] < ASIA_BOX[0][1] ||
    to[1] > ASIA_BOX[1][1]
  );
}

/**
 * 평면지도 투영.
 *
 * 아트보드 상자를 바닥값으로 두고 출발국·도착국이 그 밖이면 상자를 넓힌다.
 * B6에서 도착국이 JP·US로 늘면서 고정 상자가 도착국을 화면 밖으로 밀어냈다
 * (DISCREPANCIES §166). US는 투영 밖으로 1000px 넘게 나가 있었다.
 *
 * `safeRight`는 **도착점이 넘으면 안 되는 x**다. 지도 박스는 우측으로 흘러 잘리고
 * 마커 라벨은 점 오른쪽 자리를 더 먹는다 — 그 둘을 뺀 값이 호출부에서 온다.
 * 넘으면 축척을 줄여 다시 맞춘다. 아시아 도착국은 첫 계산에서 이미 안쪽이라
 * **결과가 지금과 픽셀 단위로 같다.**
 *
 * 출발점은 재지 않는다. 이 앱의 출발국은 KR 하나이고 `KR · 출발` 라벨이
 * 지금 자리에 들어간다 — 넣으면 아시아 조합 아홉 개의 그림이 같이 바뀐다.
 */
function planeProjection(
  w: number,
  h: number,
  from: [number, number],
  to: [number, number],
  safeRight: number,
): GeoProjection {
  const base = (ASIA_BOX[0][0] + ASIA_BOX[1][0]) / 2;
  const lngs = [
    ASIA_BOX[0][0],
    ASIA_BOX[1][0],
    unwrapLng(from[0], base),
    unwrapLng(to[0], base),
  ];
  const lats = [ASIA_BOX[0][1], ASIA_BOX[1][1], from[1], to[1]];
  const box = {
    type: 'MultiPoint' as const,
    coordinates: [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    ],
  };
  // 회전으로 중심을 옮겨야 태평양 쪽 짧은 길이 그려진다. 메르카토르의 x는 경도에
  // 선형이라 회전은 평행이동으로 흡수된다 — 상자가 안 넓어진 경우 결과가 회전
  // 전과 같은 이유다.
  const center = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const fit = (target: number) =>
    geoMercator()
      .rotate([-center, 0])
      .fitExtent(
        [
          [0, 0],
          [target, h],
        ],
        box,
      );

  let target = w;
  let proj = fit(target);
  // 폭으로 맞춰진 구간에서 x는 target에 비례하므로 보통 두 번이면 닿는다.
  for (let i = 0; i < 5; i++) {
    const q = proj(to);
    if (!q || q[0] <= safeRight) break;
    target = Math.max(40, (target * safeRight) / q[0]);
    proj = fit(target);
  }
  return proj;
}

/**
 * 지구본 투영.
 *
 * 아트보드 시점을 그대로 쓰되, 항로 양 끝 중 하나라도 그 시점에서 보이는 반구
 * 밖이면 시점을 항로 중점으로 옮긴다.
 *
 * **d3의 투영 함수는 clipAngle을 적용하지 않는다.** 스트림(geoPath)만 자른다.
 * 그래서 반대편 점을 null이 아니라 앞면에 접어서 돌려준다 — US 조합에서
 * 도착 마커가 캄차카 근처에 찍히고 있었다(§166). `if (!xy)` 가드로는 못 잡는다.
 */
function globeProjection(
  w: number,
  h: number,
  from: [number, number],
  to: [number, number],
): GeoProjection {
  const eye: [number, number] = [-GLOBE_ROTATE[0], -GLOBE_ROTATE[1]];
  const outside =
    angleBetween(eye, from) > GLOBE_VISIBLE_DEG || angleBetween(eye, to) > GLOBE_VISIBLE_DEG;
  // 중점에서 양 끝까지는 항상 항로의 절반이므로 둘 다 반드시 보인다.
  const next = outside ? midpoint(from, to) : eye;
  return geoOrthographic()
    .rotate([-next[0], -next[1]])
    .translate([w / 2, h / 2])
    .scale(Math.min(w, h) / 2 - 2)
    .clipAngle(90);
}

function projectionFor(
  mode: GeoMode,
  w: number,
  h: number,
  from: [number, number],
  to: [number, number],
  safeRight: number,
): GeoProjection {
  if (mode === 'asia') return planeProjection(w, h, from, to, safeRight);
  return globeProjection(w, h, from, to);
}

/**
 * 육지 실루엣을 오프스크린에 채우고 알파를 읽어, 격자 위 육지 칸에만 정사각 점을 찍는다.
 * 바다는 비운다. 격자선도 글로우도 없다.
 */
function buildScene(
  land: FeatureCollection<Geometry>,
  mode: GeoMode,
  w: number,
  h: number,
  colors: { dot: string; route: string; dest: string },
  originMarker: boolean,
  from: [number, number],
  to: [number, number],
  safeRight: number,
): Scene | null {
  const cfg = CFG[mode];
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const proj = projectionFor(mode, w, h, from, to, safeRight);

  // 마스크는 CSS 픽셀 그대로 그린다. 알파를 읽기만 하므로 dpr이 필요 없다.
  const mask = document.createElement('canvas');
  mask.width = w;
  mask.height = h;
  const mc = mask.getContext('2d');
  if (!mc) return null;
  mc.fillStyle = '#fff';
  mc.beginPath();
  geoPath(proj, mc)(land);
  mc.fill();
  const px = mc.getImageData(0, 0, w, h).data;

  const bg = document.createElement('canvas');
  bg.width = w * dpr;
  bg.height = h * dpr;
  const b = bg.getContext('2d');
  if (!b) return null;
  b.setTransform(dpr, 0, 0, dpr, 0, 0);

  const d = cfg.dot;
  const o = d / 2;
  b.fillStyle = colors.dot;
  for (let y = cfg.step / 2; y < h; y += cfg.step) {
    for (let x = cfg.step / 2; x < w; x += cfg.step) {
      if (px[((y | 0) * w + (x | 0)) * 4 + 3] < LAND_ALPHA) continue;
      b.fillRect(Math.round(x - o), Math.round(y - o), d, d);
    }
  }

  const p0 = proj(from);
  const p1 = proj(to);
  if (!p0 || !p1) return null;

  // 곡선이 부풀 방향. 지구본은 중심 바깥쪽으로, 평면은 항로의 법선 방향으로.
  const mx = (p0[0] + p1[0]) / 2;
  const my = (p0[1] + p1[1]) / 2;
  let nx: number;
  let ny: number;
  if (mode === 'globe') {
    const vx = mx - w / 2;
    const vy = my - h / 2;
    const l = Math.hypot(vx, vy) || 1;
    nx = vx / l;
    ny = vy / l;
  } else {
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const l = Math.hypot(dx, dy) || 1;
    nx = -dy / l;
    ny = dx / l;
    if (ny > 0) {
      nx = -nx;
      ny = -ny;
    }
  }
  const span = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const bulge = span * cfg.bulge;
  const arc: Arc = {
    p0: [p0[0], p0[1]],
    p1: [p1[0], p1[1]],
    ctrl: [mx + nx * bulge * 2, my + ny * bulge * 2],
  };

  b.strokeStyle = colors.route;
  b.lineWidth = 1;
  b.beginPath();
  b.moveTo(arc.p0[0], arc.p0[1]);
  b.quadraticCurveTo(arc.ctrl[0], arc.ctrl[1], arc.p1[0], arc.p1[1]);
  b.stroke();

  if (originMarker) {
    b.fillStyle = colors.route;
    b.fillRect(Math.round(arc.p0[0] - 2), Math.round(arc.p0[1] - 2), 4, 4);
  }

  const ds = cfg.destSize;
  b.fillStyle = colors.dest;
  b.fillRect(Math.round(arc.p1[0] - ds / 2), Math.round(arc.p1[1] - ds / 2), ds, ds);

  return { bg, proj, arc, width: w, height: h, dpr, routeColor: colors.route };
}

/** 2차 베지에 위의 점. */
function pointOnArc(arc: Arc, t: number): [number, number] {
  const u = 1 - t;
  return [
    u * u * arc.p0[0] + 2 * u * t * arc.ctrl[0] + t * t * arc.p1[0],
    u * u * arc.p0[1] + 2 * u * t * arc.ctrl[1] + t * t * arc.p1[1],
  ];
}

/** t가 null이면 배경만 그린다. */
function paint(canvas: HTMLCanvasElement, scene: Scene, t: number | null): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(scene.bg, 0, 0);
  if (t === null) return;

  ctx.setTransform(scene.dpr, 0, 0, scene.dpr, 0, 0);
  ctx.fillStyle = scene.routeColor;
  for (let i = 0; i < FLOW_COUNT; i++) {
    const ti = t - i * FLOW_GAP;
    if (ti < 0 || ti > 1) continue;
    const p = pointOnArc(scene.arc, ti);
    ctx.globalAlpha = 1 - i * FLOW_FADE;
    ctx.fillRect(
      Math.round(p[0] - FLOW_SIZE / 2),
      Math.round(p[1] - FLOW_SIZE / 2),
      FLOW_SIZE,
      FLOW_SIZE,
    );
  }
  ctx.globalAlpha = 1;
}

export function DotGeo({
  mode,
  dotColor = 'var(--geo-dot)',
  routeColor = 'var(--text)',
  destColor = 'var(--risk-critical)',
  originMarker = true,
  from = FROM,
  to = TO,
  flow = true,
  onProject,
  safeRight,
  style,
}: {
  mode: GeoMode;
  /**
   * 육지 점 색. **호출부가 반드시 명시한다** — 두 화면이 다른 값을 쓰기 때문이다.
   * S1 지구본은 --geo-dot-globe, S5 지도는 --geo-dot다. 이유는 globals.css에 적었다.
   * 기본값은 어두운 쪽(--geo-dot)이다. 라벨을 얹는 화면에서 안전한 쪽이다.
   */
  dotColor?: string;
  routeColor?: string;
  destColor?: string;
  originMarker?: boolean;
  /** 항로 출발점 [경도, 위도]. 프로필의 출발국 좌표다. */
  from?: [number, number];
  /** 항로 도착점 [경도, 위도]. 프로필의 도착국 좌표다. */
  to?: [number, number];
  flow?: boolean;
  /**
   * 투영을 밖으로 넘긴다. 원본이 'neo-ready' 이벤트로 하던 일이다.
   * S5가 국가 마커를 점 위에 얹는 데 쓴다. 리사이즈로 다시 그릴 때마다 불리므로
   * 마커가 점을 따라간다.
   */
  onProject?: (project: Projector, size: { w: number; h: number }) => void;
  /**
   * 도착점이 넘으면 안 되는 x. 지도 박스가 우측으로 흘려 잘리는 폭과 마커 라벨
   * 자리를 뺀 값을 S5가 넘긴다. 넘으면 축척을 줄여 다시 맞춘다(§166).
   * 넘기지 않으면 박스 폭 전체를 쓴다 — S1 지구본은 잘리는 자리가 없다.
   */
  safeRight?: number;
  style?: CSSProperties;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 배열은 렌더마다 새 참조라 deps에 그대로 넣으면 매번 다시 그린다.
  // 스칼라로 펴서 값이 실제로 바뀔 때만 다시 그리게 한다.
  const [fromLng, fromLat] = from;
  const [toLng, toLat] = to;

  // 콜백은 ref로 받는다. deps에 넣으면 인라인 함수를 넘긴 호출부에서
  // 렌더마다 지도를 새로 만들게 되고, setState까지 얽히면 순환한다.
  const onProjectRef = useRef(onProject);
  useEffect(() => {
    onProjectRef.current = onProject;
  });

  // 스켈레톤·에러를 호출부(S1·S5) 두 곳에서 반복하지 않고 여기서 겹친다.
  const [state, setState] = useState<GeoState>('loading');
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let disposed = false;
    let raf = 0;
    let land: FeatureCollection<Geometry> | null = null;
    let scene: Scene | null = null;

    const rebuild = () => {
      if (disposed || !land) return;
      const rect = host.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (!w || !h) return;

      canvas.width = w * Math.min(2, window.devicePixelRatio || 1);
      canvas.height = h * Math.min(2, window.devicePixelRatio || 1);

      scene = buildScene(
        land,
        mode,
        w,
        h,
        {
          dot: resolveColor(host, dotColor),
          route: resolveColor(host, routeColor),
          dest: resolveColor(host, destColor),
        },
        originMarker,
        [fromLng, fromLat],
        [toLng, toLat],
        safeRight ?? w,
      );
      if (scene) {
        paint(canvas, scene, flow ? 0 : null);
        onProjectRef.current?.(scene.proj, { w, h });
      }
    };

    const observer = new ResizeObserver(rebuild);
    observer.observe(host);

    // 250ms를 넘겨야 스켈레톤을 띄운다. 캐시에서 즉시 오면 깜빡임이 된다.
    const gate = window.setTimeout(() => {
      if (!disposed) setShowSkeleton(true);
    }, SKELETON_DELAY_MS);

    loadLand()
      .then((f) => {
        if (disposed) return;
        land = f;
        rebuild();
        setState('ready');
      })
      .catch((err) => {
        console.warn('DotGeo: 지리 데이터를 불러오지 못했습니다', err);
        if (disposed) return;
        setState('error');
      })
      .finally(() => {
        window.clearTimeout(gate);
        if (!disposed) setShowSkeleton(false);
      });

    if (flow) {
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (scene) paint(canvas, scene, (performance.now() % FLOW_PERIOD_MS) / FLOW_PERIOD_MS);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      observer.disconnect();
      window.clearTimeout(gate);
      if (raf) cancelAnimationFrame(raf);
    };
    // attempt가 바뀌면 land를 다시 받는다 — '다시 시도' 버튼의 통로다.
  }, [
    mode,
    dotColor,
    routeColor,
    destColor,
    originMarker,
    flow,
    attempt,
    fromLng,
    fromLat,
    toLng,
    toLat,
    safeRight,
  ]);

  return (
    <div
      ref={hostRef}
      style={{ position: 'relative', width: '100%', height: '100%', ...style }}
    >
      {/* aria-hidden은 캔버스에만 준다. 아래 에러 문구와 '다시 시도'는 읽혀야 한다. */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />

      {state === 'error' && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <EmptyState
            message="지도를 불러오지 못했습니다"
            size="meta"
            actionLabel="다시 시도"
            onAction={() => {
              setState('loading');
              setAttempt((n) => n + 1);
            }}
          />
        </div>
      )}

      {state === 'loading' && showSkeleton && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Skeleton height="100%" />
        </div>
      )}
    </div>
  );
}
