import type { ReactNode } from 'react';
import { TONE_COLOR, type Tone } from '@/types/neo';

/**
 * 배지. height 22, padding 0 7, radius 6. TDS washed — 연한 면에 같은 계열의 진한 글자.
 * 위험도(CRITICAL…), 카운트다운(D-433), 상태(보류·시행중), 출처(관보)가 전부 이것이다.
 */
export function Badge({
  tone,
  tnum = false,
  children,
}: {
  tone: Tone;
  tnum?: boolean;
  children: ReactNode;
}) {
  const { bg, fg } = TONE_COLOR[tone];
  return (
    <span
      className={tnum ? 't-badge tnum' : 't-badge'}
      style={{
        flex: 'none',
        height: 22,
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0 7px',
        borderRadius: 'var(--r-badge)',
        background: bg,
        color: fg,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

/**
 * 필터 칩. 34px 알약. 고른 칩은 글자색 면으로 뒤집고, 나머지는 흰 면에 1px 선.
 * 고른 칩에도 같은 색 선을 둬서 고를 때 폭이 1px도 흔들리지 않게 한다.
 */
export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="t-label"
      style={{
        flex: 'none',
        height: 34,
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0 14px',
        borderRadius: 'var(--r-full)',
        border: `1px solid ${active ? 'var(--tds-fg-primary)' : 'var(--tds-line-default)'}`,
        background: active ? 'var(--tds-fg-primary)' : 'var(--tds-bg-primary)',
        color: active ? 'var(--tds-bg-primary)' : 'var(--tds-fg-secondary)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        transition: 'background-color var(--dur-base) var(--ease), color var(--dur-base) var(--ease)',
      }}
    >
      {children}
    </button>
  );
}
