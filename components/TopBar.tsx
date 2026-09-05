import Link from 'next/link';
import type { ReactNode } from 'react';

/** 상단 바. height 40, 좌우 패딩 20. 좌/우 슬롯 두 개뿐이다. */
export function TopBar({ left, right }: { left?: ReactNode; right?: ReactNode }) {
  return (
    <div
      style={{
        height: 'var(--topbar)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--pad)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center' }}>{left}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{right}</span>
    </div>
  );
}

/**
 * 상단바 우측의 읽지 않음 배지. 12×12 색면에 9px 숫자. 배지(22px)와 다른 물건이다.
 * 0이면 아예 그리지 않는다 — "0"을 표시하지 않는다. 판단은 호출부에서 한다.
 */
export function UnreadDot({ count, href }: { count: number; href: string }) {
  return (
    <Link
      href={href}
      aria-label={`읽지 않은 알림 ${count}건`}
      className="tnum"
      style={{
        width: 12,
        height: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        border: 'none',
        background: 'var(--risk-critical)',
        font: '700 9px/1 Pretendard, sans-serif',
        color: 'var(--on-color)',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
    >
      {count}
    </Link>
  );
}
