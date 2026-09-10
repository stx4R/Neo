'use client';

import Link from 'next/link';
import { Skeleton } from '@/components/Skeleton';

/**
 * 지금 조합에 법령 데이터가 없을 때.
 *
 * EmptyState와 다른 물건이다. 저쪽은 필터 결과 0건처럼 "찾은 게 없다"를 말하고
 * 문구가 흐리다. 이쪽은 "우리가 아직 안 채웠다"를 말하고 첫 줄이 진하다.
 *
 * 12조합을 전부 채운 지금 이 화면은 **데이터 로드 실패 방어용**으로 남는다 —
 * 조합 파일이 비었거나 깨졌을 때 빈 목록 대신 무슨 일인지 말해 주는 자리다.
 */
export function ComboEmpty({ combo }: { combo: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <p className="t-body-b">이 조합의 규제 데이터가 아직 없어요</p>
      <p className="t-meta" style={{ color: 'var(--tds-fg-tertiary)' }}>
        {combo}
      </p>
      <Link href="/setup?edit=1" className="t-body-b tap-y" style={{ marginTop: 10, alignSelf: 'flex-start' }}>
        다른 조합 고르기
      </Link>
    </div>
  );
}

/**
 * 프로필을 아직 읽지 못한 한 프레임 동안의 자리.
 *
 * 프로필은 localStorage에 있고 useSyncExternalStore는 hydration 렌더에서
 * 서버 스냅샷을 쓴다. 그 사이를 0이나 예시 데이터로 채우면 잘못된 값이
 * 한 프레임 스쳐 지나간다. shimmer 금지, opacity 펄스만.
 */
export function ComboPending() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton width="60%" height={20} />
      <Skeleton width="85%" height={20} />
      <Skeleton width="45%" height={20} />
    </div>
  );
}
