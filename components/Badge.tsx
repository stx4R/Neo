import type { ReactNode } from 'react';

/**
 * 색면 배지. height 22, padding 0 7. 배경은 꽉 찬 색면, 글자는 항상 --on-color.
 * 둥글지 않다 — pill 금지.
 */
export function Badge({
  tone,
  tnum = false,
  children,
}: {
  /** 색면 배경. RISK_COLOR / STATUS_COLOR 값이나 var(--accent) 등. */
  tone: string;
  tnum?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={tnum ? 't-badge tnum' : 't-badge'}
      style={{
        flex: 'none',
        height: 'var(--badge-h)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--badge-pad)',
        background: tone,
        color: 'var(--on-color)',
      }}
    >
      {children}
    </span>
  );
}

/**
 * 배지와 같은 치수의 필터 칩. 선택되지 않으면 색면 없이 밑줄 1px 만 남는다.
 * 색을 테두리로 쓰지 않기 위한 형태다.
 */
export function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      // 칩의 시각 크기는 아트보드대로 var(--badge-h)에 글자 폭이다. 히트 영역만 44px로 넓힌다.
      // 가로 확장이 이웃 칩을 침범하지 않는다: 44보다 좁은 칩만 늘어나고(최대 4.5px씩),
      // 칩 사이 간격이 6px이며, 늘어나는 칩의 이웃은 이미 44보다 넓다.
      className="t-badge tap"
      style={{
        flex: 'none',
        height: 'var(--badge-h)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--badge-pad)',
        border: 'none',
        borderBottom: active ? 'none' : '1px solid var(--hairline)',
        background: active ? 'var(--accent)' : 'transparent',
        color: active ? 'var(--on-color)' : 'var(--text-3)',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
