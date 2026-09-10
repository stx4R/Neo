import { Icon } from '@/components/Icon';

/**
 * 오프라인 바. 프레임 상단 상태바 자리(--safe-top) 바로 아래에 앉는다.
 *
 * 보일지 말지는 Screen이 판단한다 — 같은 값으로 스크롤 영역 top도 밀어야 하므로
 * 판단이 두 곳에 있으면 어긋난다. 여기는 모양만 안다.
 *
 * 시각을 적지 않는다. 캐시가 언제 만들어졌는지 이 컴포넌트는 모르고,
 * 아는 척하려면 날짜를 지어내야 한다. 오프라인이라는 사실만 말한다.
 */
export function OfflineBar() {
  return (
    <div
      role="status"
      className="t-caption"
      style={{
        position: 'absolute',
        top: 'var(--safe-top)',
        left: 0,
        right: 0,
        height: 'var(--offline-h)',
        zIndex: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '0 var(--pad)',
        background: 'var(--risk-med-bg)',
        color: 'var(--risk-med-fg)',
      }}
    >
      <Icon name="triangle-alert" size={14} />
      오프라인이에요 · 저장된 데이터로 보여드려요
    </div>
  );
}
