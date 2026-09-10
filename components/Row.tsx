import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

/**
 * 목록 행. 카드 박스가 아니다 — 구분은 border-top 1px --hairline 으로만 한다.
 * 높이 4종은 디자인 원본 실측값이다.
 *   law    92px  S2 법률 목록 (라벨 + 제목 + 메타 3줄)
 *   action 66px  S1·S3 액션 (본문 + 메타 2줄)
 *   info   62px  S1 정보 행 (제목 + 메타 2줄)
 *   short  44px  단문 행 (한 줄)
 */
export type RowHeight = 'law' | 'action' | 'info' | 'short';

const HEIGHT: Record<RowHeight, string> = {
  law: 'var(--row-law)',
  action: 'var(--row-action)',
  info: 'var(--row-info)',
  short: 'var(--row-short)',
};

/** leading을 위로 붙일 때 쓰는 상단 여백. 원본 실측 — 92px 행은 16, 66px 행은 14. */
const LEADING_TOP: Partial<Record<RowHeight, number>> = { law: 16, action: 14 };

export function Row({
  height = 'info',
  leading,
  leadingAlign = 'center',
  trailing,
  last = false,
  dimmed = false,
  href,
  onClick,
  children,
}: {
  height?: RowHeight;
  /** 마커·순번·체크박스가 들어가는 20px 열. */
  leading?: ReactNode;
  /** 'top'이면 첫 줄에 맞춰 위로 붙는다. 3줄 이상인 행에서 쓴다. */
  leadingAlign?: 'center' | 'top';
  trailing?: ReactNode;
  /** 목록 마지막 행. border-bottom을 하나 더 그어 닫는다. */
  last?: boolean;
  /** 보류 등 힘을 뺀 행. 원본 실측 opacity .55 */
  dimmed?: boolean;
  /** 행 전체가 링크인 경우. onClick과 같이 쓰지 않는다. */
  href?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const style: CSSProperties = {
    width: '100%',
    // 아트보드 실측값은 **최소 높이**다. 고정 높이로 두면 제목이 한 줄 더 길어질 때
    // 내용이 행 밖으로 흘러 위아래 행을 덮는다 — 4차 B9에서 실기기 기하로 잡았다.
    // 인도네시아 화장품 조합의 3줄짜리 액션 제목이 66px 행을 6px 침범하고 있었다.
    // 내용이 들어가는 행은 실측값 그대로 그려진다. 안 들어가는 행만 늘어난다.
    minHeight: HEIGHT[height],
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--row-gap)',
    borderTop: '1px solid var(--hairline)',
    borderBottom: last ? '1px solid var(--hairline)' : undefined,
    borderLeft: 'none',
    borderRight: 'none',
    padding: 0,
    background: 'transparent',
    textAlign: 'left',
    color: 'inherit',
    font: 'inherit',
    opacity: dimmed ? 0.55 : undefined,
    cursor: href || onClick ? 'pointer' : undefined,
    textDecoration: 'none',
  };

  const inner = (
    <>
      {leading !== undefined && (
        <span
          style={{
            flex: 'none',
            display: 'flex',
            alignSelf: leadingAlign === 'top' ? 'flex-start' : undefined,
            marginTop:
              leadingAlign === 'top' ? LEADING_TOP[height] ?? 14 : undefined,
          }}
        >
          {leading}
        </span>
      )}

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--stack)',
        }}
      >
        {children}
      </div>

      {trailing}
    </>
  );

  if (href) {
    return (
      <Link href={href} style={style}>
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

/** 행 안에서 한 줄로 잘리는 제목. 넘치면 말줄임. */
export function RowTitle({
  as = 'h2',
  children,
}: {
  as?: 'h2' | 'span';
  children: ReactNode;
}) {
  const style = {
    margin: 0,
    color: 'var(--text)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } as const;

  return as === 'h2' ? (
    <h2 className="t-h2" style={style}>
      {children}
    </h2>
  ) : (
    <span className="t-body" style={style}>
      {children}
    </span>
  );
}

/** 행 안의 보조 줄. 숫자가 섞이므로 tabular-nums를 기본으로 켠다. */
export function RowMeta({ children }: { children: ReactNode }) {
  return (
    <span className="t-meta tnum" style={{ color: 'var(--text-3)' }}>
      {children}
    </span>
  );
}
