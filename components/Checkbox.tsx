'use client';

/**
 * 16×16 원형 체크박스. 이 앱에서 곡선이 허용되는 유일한 요소다 (.is-checkbox).
 * 마커 열과 같은 20px 폭 안에 든다.
 *
 * 체크된 상태는 아트보드에 없다 — 4행 모두 빈 상태로만 그려져 있다.
 * 원본이 박스 안에 `700 10px/1 · color:#171717`을 예약해 둔 것을 근거로
 * "색면 채움 + --on-color 글리프"로 구현했다. 색을 테두리로 쓰지 않는 규칙과도 맞는다.
 */
export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** 스크린리더용. 화면에는 나오지 않는다. */
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        flex: 'none',
        width: 'var(--mark-w)',
        height: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
      }}
    >
      <span
        className="is-checkbox"
        style={{
          width: 16,
          height: 16,
          border: `1px solid ${checked ? 'var(--accent)' : 'var(--text-3)'}`,
          background: checked ? 'var(--accent)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          font: '700 10px/1 Pretendard, sans-serif',
          color: 'var(--on-color)',
        }}
      >
        {checked ? '✓' : ''}
      </span>
    </button>
  );
}
