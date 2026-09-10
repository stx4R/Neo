'use client';

import { useLayoutEffect } from 'react';
import { IconButton } from '@/components/TopBar';
import { currentTheme, paintTheme, toggleTheme, useTheme } from '@/lib/useTheme';

/**
 * 홈 상단바의 테마 버튼. 벨 왼쪽에 선다.
 *
 * 아이콘은 누르면 갈 테마를 보인다 — 라이트에서는 달, 다크에서는 해.
 * 스크린리더에는 '다크 모드' 켜짐/꺼짐으로 읽힌다(aria-pressed).
 */
export function ThemeToggle() {
  const dark = useTheme() === 'dark';
  return (
    <IconButton
      icon={dark ? 'sun' : 'moon'}
      label="다크 모드"
      pressed={dark}
      onClick={toggleTheme}
    />
  );
}

/**
 * 저장된 테마를 <html>에 다시 입힌다. 루트 레이아웃에 한 번 둔다.
 *
 * 프로덕션에서는 할 일이 없다 — 인라인 스크립트가 이미 입혔다. dev에서만 필요하다:
 * React Strict Mode가 한 번 다시 마운트하면서 <html>의 속성을 JSX에 적힌 것만 남기고
 * 지운다. 그러면 다크를 고른 사용자가 새로고침할 때마다 라이트로 돌아간다.
 * 페인트 전에 돌도록 useLayoutEffect다. React 상태가 아니라 스토어 값을 읽는다 —
 * 하이드레이션 첫 렌더는 서버 값(라이트)이라 그걸 칠하면 한 번 지웠다 다시 단다.
 */
export function ThemeSync() {
  useLayoutEffect(() => {
    paintTheme(currentTheme());
  }, []);
  return null;
}
