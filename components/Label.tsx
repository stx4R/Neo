import type { CSSProperties, ReactNode } from 'react';

/** 섹션 라벨. .t-label — 700 11px/12px, 자간 .08em, 대문자. 기본색 --text-3. */
export function Label({
  children,
  color = 'var(--text-3)',
  block = true,
  style,
}: {
  children: ReactNode;
  color?: string;
  block?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      className="t-label"
      style={{ display: block ? 'block' : 'inline', color, ...style }}
    >
      {children}
    </span>
  );
}
