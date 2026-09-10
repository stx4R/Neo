'use client';

import { useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { SCREEN_COLOR, THEME_KEY, type ScreenBg, type Theme } from '@/lib/theme';

/**
 * 화면 테마 스토어. 라이트가 기본이고, 홈 상단바의 버튼으로 다크를 켜고 끈다.
 *
 * 기기 설정(prefers-color-scheme)은 따르지 않는다 — 기본은 늘 라이트다(사용자 확정).
 * 다크를 고르면 localStorage에 'dark'를 남기고, 다시 라이트로 돌아오면 지운다.
 * 라이트를 "고른" 것이 아니라 기본값으로 돌아간 것이다.
 *
 * 칠하는 것은 <html data-theme="dark"> 하나다. globals.css의 다크 토큰이 거기 매여 있다.
 * 첫 페인트 전에 그 속성을 다는 일은 layout.tsx의 인라인 스크립트(THEME_SCRIPT)가 한다.
 */

let snapshot: Theme = 'light';
const listeners = new Set<() => void>();

function readStored(): Theme {
  try {
    return window.localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

if (typeof window !== 'undefined') snapshot = readStored();

/** 지금 테마. 렌더 밖에서 읽을 때 쓴다. */
export function currentTheme(): Theme {
  return snapshot;
}

/** 지금 화면의 바탕. Screen이 알려준다. 기본은 첫 화면(S1 홈)의 바탕이다. */
let screenBg: ScreenBg = 'canvas';

/**
 * 브라우저 UI 색(theme-color). 지금 테마와 지금 화면 바탕이 함께 정한다.
 * meta는 app/layout.tsx의 <head>에 하나 있다. 그래도 하나라고 가정하지 않고 전부 고친다 —
 * 확인할 방법이 없는 값이라 하나만 어긋나도 모른다.
 */
function paintThemeColor(theme: Theme): void {
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute('content', SCREEN_COLOR[theme][screenBg]);
  }
}

/**
 * 화면 바탕이 바뀐 것을 알린다. Screen이 화면마다 부른다.
 *
 * 홈 화면 앱에서 상태바 자리는 iOS가 theme-color로 칠한다. 이걸 화면 바탕에 맞춰 두지
 * 않으면 흰 바탕 화면 위에 회색 띠가 얹힌 것처럼 보인다.
 */
export function paintScreenBg(bg: ScreenBg): void {
  screenBg = bg;
  paintThemeColor(snapshot);
}

/**
 * DOM에 입힌다 — <html data-theme>와 브라우저 UI 색(theme-color).
 */
export function paintTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'dark') root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');
  paintThemeColor(theme);
}

function setTheme(next: Theme): void {
  snapshot = next;
  try {
    if (next === 'dark') window.localStorage.setItem(THEME_KEY, 'dark');
    else window.localStorage.removeItem(THEME_KEY);
  } catch {
    // 저장이 막혔다. 이 세션 안에서만 유지된다.
  }
  paintTheme(next);
  for (const listener of listeners) listener();
}

/**
 * 테마를 뒤집는다. 화면 전체를 200ms 동안 새 테마로 스미게 한다
 * (View Transitions 크로스페이드, 길이는 globals.css). 지원하지 않는 브라우저와
 * 움직임을 줄이라고 한 기기에서는 즉시 바꾼다.
 *
 * flushSync — 전환이 새 화면을 찍기 전에 버튼 아이콘까지 바뀌어 있어야 한다.
 * 그렇지 않으면 새 화면에 옛 아이콘이 찍혔다가 전환이 끝난 뒤에 바뀐다.
 */
export function toggleTheme(): void {
  const next: Theme = snapshot === 'dark' ? 'light' : 'dark';
  const apply = () => flushSync(() => setTheme(next));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || typeof document.startViewTransition !== 'function') {
    apply();
    return;
  }
  // 화면을 그리지 않는 상태(탭을 가림)에서 누르면 브라우저가 전환을 접고 ready를
  // 거부한다. apply는 그대로 돌아 테마는 바뀌지만, 잡지 않으면 처리되지 않은 거부로
  // 콘솔에 찍힌다. 애니메이션만 없는 정상 경로라 조용히 흘린다.
  document.startViewTransition(apply).ready.catch(() => {});
}

// 렌더마다 새 함수를 넘기면 useSyncExternalStore가 매번 재구독한다.
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
const getSnapshot = () => snapshot;
const getServerSnapshot = (): Theme => 'light';

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
