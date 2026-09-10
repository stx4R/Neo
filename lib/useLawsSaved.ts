'use client';

import { createIdSetStore, usePersistentIdSet } from '@/lib/persistentIdSet';

/**
 * 저장한 법령 id.
 *
 * neo.actions.done · neo.notifications.read 와 같은 형태라 같은 스토어를 쓴다.
 *
 * **조합이 바뀌어도 비우지 않는다.** 완료 표시(neo.actions.done)와 다른 점이다 —
 * 완료는 그 조합에서 실제로 한 일이라 조합이 바뀌면 의미가 없어지지만,
 * 저장은 "이 법령을 다시 보겠다"는 표시라 도착국을 바꿨다 돌아와도 남아 있어야 한다.
 * 법령 id는 전역에서 유일하므로 조합이 달라도 충돌하지 않는다.
 */
const store = createIdSetStore('neo.laws.saved');

export const toggleLawSaved = store.toggle;

export function useLawsSaved(): ReadonlySet<string> {
  return usePersistentIdSet(store);
}
