import type { ReactNode } from 'react';
import { TONE_COLOR, type Tone } from '@/types/neo';

/**
 * 아이콘 타일. 목록 행 왼쪽의 둥근 정사각 — 법령 영역 아이콘, 순번, 알림 종류.
 * 색은 배지와 같은 washed 톤이다.
 * 'brand-solid'만 브랜드 면에 흰 글자로 한 단계 세운다 — S6 알림 켜기 카드 하나.
 */
export function IconTile({
  tone,
  size = 44,
  radius = 'var(--r-l)',
  label,
  children,
}: {
  tone: Tone | 'brand-solid';
  size?: number;
  radius?: string;
  /** 색이 뜻을 가질 때 읽어 줄 말. 없으면 장식으로 둔다. */
  label?: string;
  children: ReactNode;
}) {
  const { bg, fg } =
    tone === 'brand-solid'
      ? { bg: 'var(--tds-bg-brand)', fg: 'var(--tds-fg-inverse)' }
      : TONE_COLOR[tone];

  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      style={{
        flex: 'none',
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        color: fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </span>
  );
}
