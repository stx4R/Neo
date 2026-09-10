import type { CSSProperties } from 'react';

/**
 * 진행 막대. 회색 트랙 위 브랜드 채움, 양끝 둥글게. value는 0~1.
 * S1 액션 진행률(6px)과 셋업 단계(4px)가 쓴다.
 */
export function ProgressBar({
  value,
  height = 6,
  label,
  style,
}: {
  value: number;
  height?: number;
  /** 스크린리더가 읽을 이름. */
  label: string;
  style?: CSSProperties;
}) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <span
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      style={{
        display: 'block',
        height,
        borderRadius: 'var(--r-full)',
        background: 'var(--tds-bg-tertiary)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <span
        style={{
          display: 'block',
          width: `${pct}%`,
          height: '100%',
          borderRadius: 'var(--r-full)',
          background: 'var(--tds-bg-brand)',
          transition: 'width var(--dur-base) var(--ease)',
        }}
      />
    </span>
  );
}
