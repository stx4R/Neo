'use client';

import { createIdSetStore, usePersistentIdSet } from '@/lib/persistentIdSet';

/**
 * 읽은 알림 id.
 *
 * 알림 6건 중 3건은 이미 읽은 것으로 시작한다 — S6 원본에서 n-04·n-05·n-06이
 * opacity .5 에 시안 점이 없고, 헤더가 "읽지 않음 3"으로 적혀 있다.
 * 이 기본값이 없으면 첫 실행에서 미읽음이 6으로 뜨고 디자인과 어긋난다.
 *
 * 기본값이 서버 스냅샷이기도 해서, 정적 HTML부터 미읽음 3으로 그려진다.
 */
const INITIAL_READ = ['n-04', 'n-05', 'n-06'] as const;

const store = createIdSetStore('neo.notifications.read', INITIAL_READ);

export const markRead = store.add;

export function useNotificationsRead(): ReadonlySet<string> {
  return usePersistentIdSet(store);
}
