'use client';

import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';

/**
 * 렌더 예외를 받는 전역 바운더리.
 *
 * 데이터 로딩 실패 화면이 아니다 — data/*.json은 lib/data.ts가 정적으로 임포트해
 * 번들 안에 있어서 "불러오는" 순간이 없다. 여기 도달하는 건 렌더 중 던져진 예외다.
 * 실패할 수 있는 유일한 요청인 /geo/land-110m.json은 DotGeo가 제자리에서 받는다.
 *
 * 탭바를 두지 않는다. 프레임만 남겨 단일 다크 테마를 지킨다.
 */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Screen scrollPadBottom={0}>
      <div style={{ padding: '12px var(--pad) 0' }}>
        <EmptyState
          message="규제 데이터를 불러오지 못했습니다"
          actionLabel="다시 시도"
          onAction={reset}
        />
      </div>
    </Screen>
  );
}
