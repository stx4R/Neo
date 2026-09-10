'use client';

import { useSyncExternalStore } from 'react';
import { Badge } from '@/components/Badge';
import { Skeleton } from '@/components/Skeleton';
import { resolveToday } from '@/lib/dday';
import { headerBadge } from '@/lib/derive';
import type { Law } from '@/types/neo';

/**
 * S3 헤더 배지. `HIGH · D-503` 처럼 위험도 + 카운트다운이다.
 *
 * 클라이언트인 이유는 D-Day 때문이다. 페이지가 서버 컴포넌트라 여기서 계산하면
 * **정적 배포 시점의 날짜가 배지에 굳는다** — 배포하고 한 달 뒤에 열어도
 * 배포한 날 기준의 D-Day가 나온다. 게다가 서버가 찍은 값과 클라이언트가 계산한
 * 값이 달라 hydration이 깨진다.
 *
 * 다른 화면은 Dataset이 today를 들고 다니지만 여기는 프로필과 무관한 자리다 —
 * 법령의 위험도와 기한은 사용자가 누구든 같다. 그래서 직접 읽는다.
 *
 * useEffect + useState가 아니라 useSyncExternalStore를 쓴다. 이펙트 안에서
 * setState를 하면 렌더가 한 번 더 도는데, 그 사이 한 프레임이 스켈레톤으로 깜빡인다.
 * 이쪽은 hydration 직후 layout 단계에서 값이 바뀌어 페인트 전에 정리된다.
 * 구독은 비워 둔다 — 이 값은 스스로 바뀌지 않는다.
 */
const noSubscribe = () => () => {};

export function HeaderBadge({ law }: { law: Law }) {
  const today = useSyncExternalStore(noSubscribe, resolveToday, () => null);

  // 서버 HTML과 hydration 렌더의 자리. shimmer 없이 opacity 펄스만.
  if (!today) return <Skeleton width={96} height="var(--badge-h)" />;

  const badge = headerBadge(law, today);
  return (
    <Badge tone={badge.tone} tnum={badge.tnum}>
      {badge.text}
    </Badge>
  );
}
