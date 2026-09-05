'use client';

import { geoMercator, geoOrthographic, geoPath, type GeoProjection } from 'd3-geo';
import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';
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

/** 원본 실측값. 건드리지 말 것. */
const CFG = {
  globe: { step: 5.4, dot: 1.6, destSize: 4, bulge: 0.34 },
  asia: { step: 6.6, dot: 1.8, destSize: 6, bulge: 0.3 },
} as const;

const FROM: [number, number] = [129.0, 35.1]; // 부산
const TO: [number, number] = [105.9, 20.9]; // 하이퐁

const FLOW_PERIOD_MS = 4200;
const FLOW_COUNT = 3;
const FLOW_GAP = 0.055;
const FLOW_FADE = 0.34;
const FLOW_SIZE = 3;

/** 알파 임계값. 마스크에서 이 값 미만이면 바다로 본다. */
const LAND_ALPHA = 120;

interface Arc {
  p0: [number, number];
  p1: [number, number];
  ctrl: [number, number];
}

interface Scene {
  bg: HTMLCanvasElement;
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

function projectionFor(mode: GeoMode, w: number, h: number): GeoProjection {
  if (mode === 'asia') {
    return geoMercator().fitExtent(
      [
        [0, 0],
        [w, h],
      ],
      { type: 'MultiPoint', coordinates: [[92, -12], [146, 47]] },
    );
  }
  return geoOrthographic()
    .rotate([-116, -18])
    .translate([w / 2, h / 2])
    .scale(Math.min(w, h) / 2 - 2)
    .clipAngle(90);
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
): Scene | null {
  const cfg = CFG[mode];
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const proj = projectionFor(mode, w, h);

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

  const p0 = proj(FROM);
  const p1 = proj(TO);
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

  return { bg, arc, width: w, height: h, dpr, routeColor: colors.route };
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
  dotColor = 'var(--text-3)',
  routeColor = 'var(--text)',
  destColor = 'var(--risk-critical)',
  originMarker = true,
  flow = true,
  style,
}: {
  mode: GeoMode;
  /** 육지 점 색. 원본은 --text-3 이고 S5 명세는 --geo-dot 이다. */
  dotColor?: string;
  routeColor?: string;
  destColor?: string;
  originMarker?: boolean;
  flow?: boolean;
  style?: CSSProperties;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      );
      if (scene) paint(canvas, scene, flow ? 0 : null);
    };

    const observer = new ResizeObserver(rebuild);
    observer.observe(host);

    // 데이터를 받기 전에는 빈 캔버스를 유지한다. 플레이스홀더를 그리지 않는다.
    loadLand()
      .then((f) => {
        if (disposed) return;
        land = f;
        rebuild();
      })
      .catch((err) => {
        console.warn('DotGeo: 지리 데이터를 불러오지 못했습니다', err);
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
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mode, dotColor, routeColor, destColor, originMarker, flow]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{ position: 'relative', width: '100%', height: '100%', ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
