'use client';

import { useSyncExternalStore } from 'react';
import { clearActionsDone } from '@/lib/useActionsDone';
import { clearNotificationsRead } from '@/lib/useNotificationsRead';
import type { Profile } from '@/types/neo';

/**
 * 사용자의 상황 — 출발국 / 도착국 / 품목 / 회사명 / 제품.
 *
 * usePriorities와 같은 모양이다(객체 하나라 persistentIdSet에 넣지 않는다).
 * 다른 점은 "값이 없는 상태"가 정상이라는 것이다 — 첫 실행에는 프로필이 없고,
 * 그때 앱은 /setup으로 간다. 그래서 기본값이 SEED가 아니라 null이다.
 *
 * 저장은 무조건 성공한 척하지 않는다. 시크릿 모드·사이트 데이터 차단에서는
 * localStorage 접근 자체가 throw 하므로 그 세션 동안 메모리 상태로만 동작한다.
 * 새로고침하면 다시 /setup으로 가지만, 크래시하지는 않는다.
 */

const KEY = 'neo.profile';

/** 저장된 값이 없을 때의 상태이자 서버 스냅샷. 참조가 고정되어야 한다. */
const NONE = null;

let snapshot: Profile | null = NONE;
const listeners = new Set<() => void>();

function isProfile(v: unknown): v is Profile {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  if (typeof p.originCountry !== 'string') return false;
  if (typeof p.destinationCountry !== 'string') return false;
  if (typeof p.itemCategory !== 'string') return false;
  if (typeof p.updatedAt !== 'string') return false;
  if (p.companyName !== undefined && typeof p.companyName !== 'string') return false;
  if (!Array.isArray(p.products)) return false;
  return p.products.every((item) => {
    if (typeof item !== 'object' || item === null) return false;
    const prod = item as Record<string, unknown>;
    return (
      typeof prod.id === 'string' &&
      typeof prod.name === 'string' &&
      typeof prod.hsCode === 'string'
    );
  });
}

function parse(json: string): Profile | null {
  try {
    const value: unknown = JSON.parse(json);
    // 형태가 어긋나면 없는 것으로 친다. 깨진 프로필로 앱을 띄우는 것보다
    // /setup을 다시 거치게 하는 편이 낫다.
    return isProfile(value) ? value : NONE;
  } catch {
    return NONE;
  }
}

if (typeof window !== 'undefined') {
  try {
    const raw = window.localStorage.getItem(KEY);
    snapshot = raw === null ? NONE : parse(raw);
  } catch {
    snapshot = NONE;
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

/**
 * 프로필을 저장한다.
 *
 * 국가나 품목이 실제로 바뀌면 neo.actions.done과 neo.notifications.read를 비운다 —
 * 다른 조합의 완료 표시가 남아 있으면 안 된다. 확인은 호출부(/setup의 경고 블록)가
 * 이미 받았다. neo.priorities는 카테고리 키 기준이라 국가가 바뀌어도 유효하다.
 * 유지한다.
 */
export function saveProfile(next: Profile): void {
  const prev = snapshot;
  const combinationChanged =
    prev !== null &&
    (prev.originCountry !== next.originCountry ||
      prev.destinationCountry !== next.destinationCountry ||
      prev.itemCategory !== next.itemCategory);

  snapshot = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // 저장이 막혔다. 세션 안에서만 유지된다.
  }
  if (combinationChanged) {
    clearActionsDone();
    clearNotificationsRead();
  }
  emit();
}

/** 지금 저장된 프로필. 렌더 밖에서 읽을 때 쓴다(리다이렉트 판정 등). */
export function readProfile(): Profile | null {
  return snapshot;
}

// 렌더마다 새 함수를 넘기면 useSyncExternalStore가 매번 재구독한다.
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
const getSnapshot = () => snapshot;
const getServerSnapshot = () => NONE;

export function useProfile(): Profile | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
