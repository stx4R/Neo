import { STATUS_COLOR, STATUS_MARK, type LawStatus } from '@/types/neo';

/**
 * 한자 상태 마커. 施(시행중) 留(보류) 豫(예정).
 * .t-mark 의 serif 폴백을 반드시 유지한다 — Pretendard에 이 세 글자가 없어서
 * serif로 떨어지고, 그래서 텍스트가 아닌 기호로 읽힌다. 이 앱의 서명이다.
 */
export function Mark({
  status,
  fixedWidth = true,
  color,
}: {
  status: LawStatus;
  /** false면 자연폭. S1 상단 상태 스트립처럼 마커 열이 없는 행에서 쓴다. */
  fixedWidth?: boolean;
  /** 색을 강제로 덮어쓸 때만. 기본은 status에 매인다. */
  color?: string;
}) {
  return (
    <span
      className="t-mark"
      style={{
        flex: 'none',
        width: fixedWidth ? 'var(--mark-w)' : undefined,
        color: color ?? STATUS_COLOR[status],
      }}
    >
      {STATUS_MARK[status]}
    </span>
  );
}

/** 순번 열. 마커와 같은 20px 열을 쓰지만 .t-label 이다. */
export function Ordinal({ n }: { n: number }) {
  return (
    <span
      className="t-label tnum"
      style={{ flex: 'none', width: 'var(--mark-w)', color: 'var(--text-3)' }}
    >
      {String(n).padStart(2, '0')}
    </span>
  );
}
