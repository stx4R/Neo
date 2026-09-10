import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

/**
 * 카드. 흰 면 + 1px line-subtle + radius 20. 그림자가 없다 — 카드는 떠 있지 않다.
 * 안의 행 구분은 Row의 1px line-default가 맡는다.
 *
 * padding은 디자인 원본이 카드마다 다르게 준 값을 그대로 받는다 —
 * 목록 카드 4 20, 요약 카드 18 20, 선택 목록 6.
 * href를 주면 카드 전체가 링크다.
 */
export function Card({
  children,
  padding = '4px 20px',
  radius = 'var(--r-card)',
  href,
  style,
}: {
  children: ReactNode;
  padding?: string | number;
  radius?: string;
  href?: string;
  style?: CSSProperties;
}) {
  const s: CSSProperties = {
    display: 'block',
    padding,
    borderRadius: radius,
    background: 'var(--tds-bg-primary)',
    border: '1px solid var(--tds-line-subtle)',
    color: 'inherit',
    textDecoration: 'none',
    ...style,
  };

  return href ? (
    <Link href={href} style={s}>
      {children}
    </Link>
  ) : (
    <div style={s}>{children}</div>
  );
}
