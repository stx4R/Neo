'use client';

import { useSyncExternalStore } from 'react';
import { priorities as SEED } from '@/lib/data';
import { CATEGORY_LABEL, type Category, type Priority } from '@/types/neo';

/**
 * 관심 규제 영역.
 *
 * neo.actions.done · neo.notifications.read 와 달리 id 집합이 아니라 객체 배열이라
 * persistentIdSet 에 넣지 않았다. 형태가 다른 것을 같은 훅에 밀어 넣으면
 * 양쪽 다 이상해진다.
 *
 * 제거는 만들지 않는다 — 디자인에 없다. 한 방향 동작이다.
 */

const KEY = 'neo.priorities';

/** 저장된 값이 없을 때의 기본값이자 서버 스냅샷. 참조가 고정되어야 한다. */
const DEFAULT: readonly Priority[] = SEED;

let snapshot: readonly Priority[] = DEFAULT;
const listeners = new Set<() => void>();

function isPriority(v: unknown): v is Priority {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.category === 'string' &&
    p.category in CATEGORY_LABEL
  );
}

function parse(json: string): readonly Priority[] {
  try {
    const value: unknown = JSON.parse(json);
    // 하나라도 형태가 어긋나면 통째로 기본값으로 되돌린다.
    if (!Array.isArray(value) || !value.every(isPriority)) return DEFAULT;
    return value;
  } catch {
    return DEFAULT;
  }
}

if (typeof window !== 'undefined') {
  try {
    const raw = window.localStorage.getItem(KEY);
    snapshot = raw === null ? DEFAULT : parse(raw);
  } catch {
    snapshot = DEFAULT;
  }
}

export function addPriority(category: Category): void {
  if (snapshot.some((p) => p.category === category)) return;
  snapshot = [
    ...snapshot,
    { id: `pr-${category}`, name: CATEGORY_LABEL[category], category },
  ];
  try {
    window.localStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    // 저장이 막혔다. 세션 안에서만 유지된다.
  }
  for (const listener of listeners) listener();
}

// 렌더마다 새 함수를 넘기면 useSyncExternalStore가 매번 재구독한다.
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
const getSnapshot = () => snapshot;
const getServerSnapshot = () => DEFAULT;

export function usePriorities(): readonly Priority[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
