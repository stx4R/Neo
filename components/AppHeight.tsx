'use client';

import { useLayoutEffect } from 'react';

/**
 * 화면 높이 실측. globals.css의 --app-h에 window.innerHeight를 넣는다.
 *
 * 홈 화면 앱(standalone)에서만 쓰인다. iOS는 그 모드에서 뷰포트 단위(lvh)를 상태바까지
 * 포함한 화면 전체로 재는데, statusBarStyle이 "default"라 웹뷰는 상태바 아래에서
 * 시작한다. 그 차이만큼 프레임이 길어져 탭바 아래가 잘렸다(§169).
 * innerHeight는 그 웹뷰의 높이라 어긋나지 않는다 — 추측 대신 실측을 쓴다.
 *
 * 키보드가 올라와도 iOS는 innerHeight를 줄이지 않으므로 입력 중에 프레임이 흔들리지 않는다.
 * 첫 페인트 전에 넣도록 useLayoutEffect다.
 */
export function AppHeight() {
  useLayoutEffect(() => {
    const measure = () => {
      document.documentElement.style.setProperty('--app-h', `${window.innerHeight}px`);
    };
    measure();
    // 회전으로 화면이 바뀌어도 resize로 온다.
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  return null;
}
