'use client';

import { createIdSetStore, usePersistentIdSet } from '@/lib/persistentIdSet';

/**
 * 완료한 액션 id.
 *
 * 화면별로 따로 읽지 않는다 — S1의 "대응 필요 N건", S2의 미완 수, S3의 체크박스,
 * S4의 타일 미완 수가 같은 스냅샷을 본다. 따로 읽으면 반드시 어긋난다.
 */
const store = createIdSetStore('neo.actions.done');

export const toggleAction = store.toggle;
export const clearActionsDone = store.clear;

export function useActionsDone(): ReadonlySet<string> {
  return usePersistentIdSet(store);
}
