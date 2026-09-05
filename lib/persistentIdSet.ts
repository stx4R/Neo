'use client';

import { useSyncExternalStore } from 'react';

/**
 * id 집합 하나를 localStorage에 담아 두는 스토어.
 *
 * neo.actions.done 과 neo.notifications.read 가 형태가 같아서 여기로 뽑았다.
 * neo.priorities 는 객체 배열이라 형태가 다르다 — 억지로 여기 넣지 않는다.
 *
 * useSyncExternalStore를 쓰는 이유: useEffect + useState였다면 갱신이 passive
 * 이펙트라 페인트 후에 반영돼 한 프레임 깜빡인다. 스냅샷 일치 검사는 layout
 * 단계에서 돌아 페인트 전에 동기 재렌더를 강제한다.
 */

export interface IdSetStore {
  subscribe(listener: () => void): () => void;
  getSnapshot(): ReadonlySet<string>;
  getServerSnapshot(): ReadonlySet<string>;
  /** 하나를 뒤집는다. */
  toggle(id: string): void;
  /** 여러 개를 한 번에 넣는다. 이미 있는 것은 그대로 둔다. */
  add(ids: readonly string[]): void;
}

export function createIdSetStore(key: string, initial: readonly string[] = []): IdSetStore {
  // 저장된 값이 아예 없을 때의 기본값. 서버 스냅샷도 이것이다.
  // 참조가 고정되어야 한다 — 매번 새 Set을 주면 무한 렌더가 된다.
  const DEFAULT: ReadonlySet<string> = new Set(initial);

  let snapshot: ReadonlySet<string> = DEFAULT;
  const listeners = new Set<() => void>();

  function parse(json: string): ReadonlySet<string> {
    try {
      const value: unknown = JSON.parse(json);
      if (!Array.isArray(value)) return DEFAULT;
      return new Set(value.filter((v): v is string => typeof v === 'string'));
    } catch {
      // 값이 깨져 있어도 기본값으로 복구하고 넘어간다.
      return DEFAULT;
    }
  }

  // 클라이언트에서 모듈이 로드될 때 한 번 읽는다.
  // hydration 렌더는 getServerSnapshot을 쓰므로 여기서 값이 달라도 불일치가 나지 않는다.
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(key);
      // 키가 없을 때만 기본값이다. 빈 배열이 저장돼 있으면 그건 사용자의 선택이다.
      snapshot = raw === null ? DEFAULT : parse(raw);
    } catch {
      // 시크릿 모드·사이트 데이터 차단에서는 window.localStorage 접근 자체가 throw 한다.
      // 이 세션 동안 메모리 상태로만 동작한다.
      snapshot = DEFAULT;
    }
  }

  function commit(next: ReadonlySet<string>): void {
    snapshot = next;
    try {
      window.localStorage.setItem(key, JSON.stringify([...next]));
    } catch {
      // 저장이 막혔다. 화면은 계속 동작하고, 새로고침하면 초기화된다.
    }
    for (const listener of listeners) listener();
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => snapshot,
    getServerSnapshot: () => DEFAULT,
    toggle(id) {
      // 렌더 시점의 값이 아니라 지금 스냅샷에서 계산한다.
      const next = new Set(snapshot);
      if (!next.delete(id)) next.add(id);
      commit(next);
    },
    add(ids) {
      const next = new Set(snapshot);
      const before = next.size;
      for (const id of ids) next.add(id);
      if (next.size !== before) commit(next);
    },
  };
}

export function usePersistentIdSet(store: IdSetStore): ReadonlySet<string> {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}
