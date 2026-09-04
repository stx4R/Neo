'use client';

import { useSyncExternalStore } from 'react';

/**
 * 완료한 액션 id 하나만 들고 있는 스토어. 키는 neo.actions.done.
 *
 * 화면별로 따로 읽지 않는다 — S1의 "대응 필요 N건", S2의 미완 수, S3의 체크박스가
 * 같은 스냅샷을 본다. 따로 읽으면 반드시 어긋난다.
 *
 * useSyncExternalStore를 쓰는 이유: useEffect + useState로 하면 첫 렌더가 빈 상태로
 * 그려진 뒤 이펙트에서 다시 그려져 체크가 풀린 채 깜빡인다.
 *
 * 범용 스토리지 훅으로 일반화하지 않았다. neo.notifications.read 등이 붙는
 * 7단계에 실제로 두 번째가 생기면 그때 공통부를 뽑는다.
 */

const KEY = 'neo.actions.done';

/** 서버 스냅샷은 언제나 이 참조여야 한다. 매번 새 Set을 주면 무한 렌더가 된다. */
const EMPTY: ReadonlySet<string> = new Set();

let snapshot: ReadonlySet<string> = EMPTY;
const listeners = new Set<() => void>();

function parse(json: string): ReadonlySet<string> {
  try {
    const value: unknown = JSON.parse(json);
    if (!Array.isArray(value)) return EMPTY;
    return new Set(value.filter((v): v is string => typeof v === 'string'));
  } catch {
    // 값이 깨져 있어도(손으로 "not json"을 넣어도) 빈 상태로 복구하고 넘어간다.
    return EMPTY;
  }
}

// 클라이언트에서 모듈이 로드될 때 한 번 읽는다.
// hydration 렌더는 getServerSnapshot을 쓰므로 여기서 값이 달라도 불일치가 나지 않는다.
if (typeof window !== 'undefined') {
  try {
    snapshot = parse(window.localStorage.getItem(KEY) ?? '[]');
  } catch {
    // 시크릿 모드나 사이트 데이터 차단에서는 getItem 자체가 throw 한다.
    // 이 세션 동안 메모리 상태로만 동작한다.
    snapshot = EMPTY;
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ReadonlySet<string> {
  return snapshot;
}

function getServerSnapshot(): ReadonlySet<string> {
  return EMPTY;
}

/** 액션 하나를 완료/미완료로 뒤집는다. */
export function toggleAction(id: string): void {
  // 렌더 시점의 값이 아니라 지금 스냅샷에서 계산한다.
  const next = new Set(snapshot);
  if (!next.delete(id)) next.add(id);
  snapshot = next;

  try {
    window.localStorage.setItem(KEY, JSON.stringify([...next]));
  } catch {
    // 저장이 막혔다. 화면은 계속 동작하고, 새로고침하면 초기화된다.
  }

  for (const listener of listeners) listener();
}

/** 완료한 액션 id 집합. */
export function useActionsDone(): ReadonlySet<string> {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
