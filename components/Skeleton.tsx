import type { CSSProperties } from 'react';

/**
 * 로딩 자리를 채우는 회색 블록.
 *
 * shimmer 금지 — 좌→우로 흐르는 광택은 TDS도 금한다. opacity 펄스만 쓴다.
 * @keyframes는 globals.css의 neo-pulse 하나이고, prefers-reduced-motion에서 멈춘다.
 *
 * 목록에는 쓰지 않는다. data/*.json은 lib/data.ts가 정적으로 임포트해 번들에
 * 들어 있어서 로딩 순간 자체가 없다. 실제로 기다리는 것은 /geo/land-110m.json,
 * 프로필을 읽기 전 한 프레임, 그리고 클라이언트에서만 계산하는 D-Day뿐이다.
 */
export function Skeleton({
  width = '100%',
  height,
  radius = 'var(--r-badge)',
  style,
}: {
  width?: number | string;
  height: number | string;
  radius?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className="neo-pulse"
      style={{ width, height, borderRadius: radius, background: 'var(--tds-bg-secondary)', ...style }}
    />
  );
}
