import type { CSSProperties } from 'react';

/**
 * 로딩 자리를 채우는 --surface 블록.
 *
 * shimmer 금지 — 좌→우로 흐르는 광택이 곧 글로우다. opacity 펄스만 쓴다.
 * @keyframes는 globals.css의 neo-pulse 하나이고, prefers-reduced-motion에서 멈춘다.
 *
 * 목록에는 쓰지 않는다. data/*.json은 lib/data.ts가 정적으로 임포트해 번들에
 * 들어 있어서 로딩 순간 자체가 없다. 앱에서 실제로 비동기인 것은
 * /geo/land-110m.json 하나뿐이라 이 블록도 DotGeo 자리에만 쓴다.
 */
export function Skeleton({
  width = '100%',
  height,
  style,
}: {
  width?: number | string;
  height: number | string;
  style?: CSSProperties;
}) {
  return (
    <div
      className="neo-pulse"
      style={{ width, height, background: 'var(--surface)', ...style }}
    />
  );
}
