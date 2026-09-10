import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';

/**
 * 상단 바. 56px. 좌·우 슬롯 둘.
 *
 * 제목으로 시작하는 화면은 좌우 24, 아이콘 버튼으로 시작하는 화면은 16이다 —
 * 40px 버튼 안에서 아이콘이 8px 들어가 있어 16이어야 글리프가 본문의 24 선에 선다.
 */
export function TopBar({
  left,
  right,
  inset = 24,
}: {
  left?: ReactNode;
  right?: ReactNode;
  inset?: 16 | 24;
}) {
  return (
    <div
      style={{
        height: 'var(--topbar)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: `0 ${inset}px`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
        {left}
      </div>
      {right && (
        <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>{right}</div>
      )}
    </div>
  );
}

const ICON_BUTTON: CSSProperties = {
  position: 'relative',
  flex: 'none',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  borderRadius: 'var(--r-m)',
  cursor: 'pointer',
};

/** 40px 아이콘 버튼. 아이콘은 기본 24. href면 링크, 아니면 버튼이다. */
export function IconButton({
  icon,
  label,
  href,
  onClick,
  pressed,
  filled = false,
  color = 'var(--tds-fg-primary)',
  stroke = 1.75,
  size = 24,
}: {
  icon: IconName;
  /** 스크린리더용 이름. 아이콘만 있는 버튼이라 반드시 넘긴다. */
  label: string;
  href?: string;
  onClick?: () => void;
  /** 켜고 끄는 버튼이면 상태. */
  pressed?: boolean;
  filled?: boolean;
  color?: string;
  stroke?: number;
  size?: number;
}) {
  const glyph = <Icon name={icon} size={size} stroke={stroke} filled={filled} />;
  if (href) {
    return (
      <Link href={href} aria-label={label} className="tap" style={{ ...ICON_BUTTON, color }}>
        {glyph}
      </Link>
    );
  }
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className="tap"
      style={{ ...ICON_BUTTON, color }}
    >
      {glyph}
    </button>
  );
}

/**
 * 알림 벨. 읽지 않은 수가 있으면 우상단에 빨간 숫자를 단다. 0이면 숫자를 그리지
 * 않는다 — "0"을 표시하지 않는다. 벨 자체는 0이어도 남는다. 알림 화면으로 가는 길이다.
 */
export function BellButton({ count, href }: { count: number; href: string }) {
  return (
    <Link
      href={href}
      aria-label={count > 0 ? `알림, 읽지 않음 ${count}건` : '알림'}
      className="tap"
      style={{ ...ICON_BUTTON, color: 'var(--tds-fg-primary)' }}
    >
      <Icon name="bell" />
      {count > 0 && (
        <span
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            minWidth: 18,
            height: 18,
            padding: '0 5px',
            borderRadius: 'var(--r-full)',
            background: 'var(--tds-fg-danger)',
            color: 'var(--tds-fg-inverse)',
            font: '700 11px/18px var(--font)',
            fontVariantNumeric: 'tabular-nums',
            textAlign: 'center',
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
