/**
 * 빈 상태 · 에러 문구. 한 줄 + 선택적 --accent 밑줄 액션.
 * 일러스트 없다. 아이콘도 없다. 좌측 정렬이고 radius 0이다 —
 * 상태 화면도 §4 절대 규칙에서 예외가 아니다.
 *
 * size는 문구의 위계다. S2 목록 자리는 Body, S4 우선순위 아래와 DotGeo 자리는
 * 본문이 아니라 곁말이라 Meta다.
 */
export function EmptyState({
  message,
  size = 'body',
  actionLabel,
  onAction,
}: {
  message: string;
  size?: 'body' | 'meta';
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 'var(--lbl-gap)',
      }}
    >
      <p
        className={size === 'body' ? 't-body' : 't-meta'}
        style={{ margin: 0, color: 'var(--text-3)' }}
      >
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="t-body"
          onClick={onAction}
          style={{
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: 'var(--accent)',
            textDecoration: 'underline',
            // button의 UA 기본값이 center다. 좌측 정렬을 명시한다.
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
