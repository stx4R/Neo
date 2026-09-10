import { Button } from '@/components/Button';

/**
 * 빈 상태 · 에러 문구. 한 줄 + 선택적인 텍스트 버튼 하나.
 * 일러스트는 없다 — 쓸 수 있는 에셋이 없고, 이모지로 대신하지 않는다.
 *
 * size는 문구의 위계다. 목록 자리는 body, S4 곁말과 지도 자리는 meta다.
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
      <p
        className={size === 'body' ? 't-body' : 't-meta'}
        style={{ color: 'var(--tds-fg-tertiary)' }}
      >
        {message}
      </p>
      {actionLabel && onAction && (
        // ghost 버튼의 좌우 패딩만큼 당겨 글자를 문구와 한 선에 세운다.
        <Button variant="ghost" size="m" onClick={onAction} style={{ marginLeft: -16 }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
