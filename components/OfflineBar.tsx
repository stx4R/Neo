import { REFERENCE_DATE, formatSyncTime } from '@/lib/dday';

/**
 * 오프라인 바. 프레임 상단 상태바 자리(--safe-top) 바로 아래에 앉는다.
 *
 * 보일지 말지는 Screen이 판단한다 — 같은 값으로 스크롤 영역 top도 밀어야 하므로
 * 판단이 두 곳에 있으면 어긋난다. 여기는 모양만 안다.
 *
 * 서비스워커와 실제 캐시는 11단계다. 지금은 연결 여부만 보고,
 * "기준 캐시" 시각은 목 데이터의 기준일이다 — new Date()를 쓰지 않는다.
 */
export function OfflineBar() {
  return (
    <div
      role="status"
      className="t-label tnum"
      style={{
        position: 'absolute',
        top: 'var(--safe-top)',
        left: 0,
        right: 0,
        height: 'var(--badge-h)',
        zIndex: 6,
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--pad)',
        background: 'var(--risk-medium)',
        color: 'var(--on-color)',
      }}
    >
      오프라인 · {formatSyncTime(REFERENCE_DATE)} 기준 캐시
    </div>
  );
}
