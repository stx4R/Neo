'use client';

import { useSyncExternalStore } from 'react';

/**
 * 설치 프롬프트.
 *
 * 2회차 방문부터 배너를 띄운다. "나중에"를 누르면 다시 띄우지 않는다.
 *
 * `beforeinstallprompt`가 없는 브라우저에서는 배너가 아예 뜨지 않는다 — iOS Safari가
 * 그렇다. 거기서는 공유 시트의 "홈 화면에 추가"뿐이고, 우리가 대신 눌러 줄 방법이 없다.
 * 없는 버튼을 안내 문구로 흉내내지 않는다.
 *
 * 리스너를 모듈 로드 시점에 건다. 크롬은 매니페스트를 처리하자마자 이 이벤트를 쏘는데,
 * 컴포넌트 마운트를 기다리면 놓칠 수 있다.
 *
 * localStorage 접근은 기존 스토어들처럼 전부 try/catch다 — 시크릿 모드와
 * 사이트 데이터 차단에서는 접근 자체가 throw 한다.
 */

const VISITS_KEY = 'neo.visits';
const DISMISSED_KEY = 'neo.install.dismissed';

/** 배너를 띄우기 시작하는 방문 횟수. 첫 방문에는 띄우지 않는다. */
const VISITS_BEFORE_PROMPT = 2;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let visits = 0;
let dismissed = false;
let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

if (typeof window !== 'undefined') {
  // 모듈이 로드될 때 한 번 올린다. 클라이언트 내비게이션으로는 늘지 않는다 —
  // 탭을 오간 것은 다시 방문한 것이 아니다.
  try {
    visits = Number(window.localStorage.getItem(VISITS_KEY) ?? '0') + 1;
    if (!Number.isFinite(visits) || visits < 1) visits = 1;
    window.localStorage.setItem(VISITS_KEY, String(visits));
    dismissed = window.localStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    // 저장이 막혔다. 세션마다 첫 방문으로 보이고 배너는 뜨지 않는다.
    visits = 1;
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    // 크롬 기본 미니 인포바를 막고 우리 배너로 대신한다.
    event.preventDefault();
    deferred = event as BeforeInstallPromptEvent;
    notify();
  });
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// 조건을 스냅샷 하나로 접는다. 배너는 이 값이 null인지만 보면 된다.
const getSnapshot = () =>
  dismissed || visits < VISITS_BEFORE_PROMPT ? null : deferred;

// 서버는 방문 횟수도 이벤트도 모른다. 하이드레이션 시점에는 언제나 배너가 없다.
const getServerSnapshot = () => null;

export function useInstallPrompt(): BeforeInstallPromptEvent | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** 브라우저 설치 프롬프트를 띄운다. 이벤트는 한 번만 쓸 수 있다. */
export async function showInstallPrompt(): Promise<void> {
  const event = deferred;
  if (!event) return;
  deferred = null;
  notify();
  try {
    await event.prompt();
  } catch (err) {
    console.warn('설치 프롬프트 실패', err);
  }
}

/** "나중에". 다시 묻지 않는다. */
export function dismissInstall(): void {
  dismissed = true;
  try {
    window.localStorage.setItem(DISMISSED_KEY, '1');
  } catch {
    // 저장이 막혔다. 이 세션 동안만 유지된다.
  }
  notify();
}
