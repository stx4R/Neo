import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

/**
 * 목록 행. 카드 안에서도, 카드 없이 목록을 까는 화면(S2)에서도 같은 부품이다.
 *
 * 행 사이는 아래 1px line-default로 가른다. 마지막 행에 선을 그을지는 호출부가
 * 정한다 — 카드 안 마지막 행은 카드 모서리가 닫고, S2 목록은 마지막 행까지 긋는다.
 *
 * 높이는 고정하지 않는다. 위아래 패딩만 주고 내용이 높이를 정한다 —
 * 제목이 두 줄이 되는 조합이 실제로 있다(4차 B9).
 */
export function Row({
  leading,
  trailing,
  children,
  align = 'center',
  divider = true,
  padding = '14px 0',
  gap = 3,
  dimmed = false,
  href,
  onClick,
}: {
  /** 왼쪽 열 — 아이콘 타일·체크박스. */
  leading?: ReactNode;
  /** 오른쪽 열 — 배지·시각·지우기 버튼. */
  trailing?: ReactNode;
  children: ReactNode;
  /** 'start'면 위로 붙는다. 제목이 여러 줄인 행에서 쓴다. */
  align?: 'center' | 'start';
  divider?: boolean;
  padding?: string;
  /** 가운데 열의 줄 간격. */
  gap?: number;
  /** 보류 등 힘을 뺀 행. 디자인 원본 실측 opacity .55 */
  dimmed?: boolean;
  /** 행 전체가 링크인 경우. onClick을 같이 주면 이동하면서 그것도 부른다(S6 읽음 표시). */
  href?: string;
  onClick?: () => void;
}) {
  const style: CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: align === 'start' ? 'flex-start' : 'center',
    gap: 14,
    padding,
    borderBottom: divider ? '1px solid var(--tds-line-default)' : undefined,
    textAlign: 'left',
    color: 'inherit',
    textDecoration: 'none',
    opacity: dimmed ? 0.55 : undefined,
    cursor: href || onClick ? 'pointer' : undefined,
  };

  const inner = (
    <>
      {leading !== undefined && <span style={{ flex: 'none', display: 'flex' }}>{leading}</span>}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap }}>
        {children}
      </div>
      {trailing}
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} style={style}>
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} style={style}>
        {inner}
      </button>
    );
  }
  return <div style={style}>{inner}</div>;
}

/**
 * 이름표 + 값 한 줄. S4 회사 정보와 S3 출처가 쓴다.
 * 이름표 열은 88px로 고정해 값이 한 세로선에 선다.
 */
export function InfoRow({
  label,
  children,
  divider = true,
}: {
  label: string;
  children: ReactNode;
  divider?: boolean;
}) {
  return (
    <div
      style={{
        minHeight: 48,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
        borderBottom: divider ? '1px solid var(--tds-line-default)' : undefined,
      }}
    >
      <span className="t-meta" style={{ flex: 'none', width: 88, color: 'var(--tds-fg-tertiary)' }}>
        {label}
      </span>
      <span className="t-body tnum" style={{ flex: 1, minWidth: 0 }}>
        {children}
      </span>
    </div>
  );
}
