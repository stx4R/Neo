/**
 * 화면 테마의 공용 값. 서버(layout.tsx의 인라인 스크립트·manifest.ts)와 클라이언트
 * (lib/useTheme.ts)가 같이 읽는다. 'use client' 모듈에 두면 서버 쪽에는 문자열이 아니라
 * 클라이언트 참조로 들어오므로 여기 따로 둔다.
 *
 * 라이트가 기본이다. 기기 설정(prefers-color-scheme)은 따르지 않는다(사용자 확정).
 */
export type Theme = 'light' | 'dark';

/** localStorage 키. 다크를 골랐을 때만 'dark'가 들어 있다. 없으면 기본값(라이트)이다. */
export const THEME_KEY = 'neo.theme';

/** 화면 바탕의 두 갈래. components/Screen.tsx의 bg와 같은 이름이다. */
export type ScreenBg = 'canvas' | 'primary';

/**
 * 화면 바탕색(meta theme-color). 같은 이름의 CSS 토큰과 같은 값이다 —
 * meta와 매니페스트는 CSS 변수를 못 읽어 리터럴이다.
 *   canvas   --tds-bg-canvas   라이트 oklch(0.968 0.004 247) · 다크 oklch(0.185 0.019 254)
 *   primary  --tds-bg-primary  라이트 oklch(1 0 0) · 다크 oklch(0.222 0.020 254)
 *
 * 홈 화면 앱에서 상태바 자리는 앱이 못 그린다 — iOS가 이 색으로 칠한다. 화면마다 바탕이
 * 갈리므로 한 색으로 두면 흰 화면(S2·S3·S5·S6) 위에 회색 띠가 남는다. 지금 화면의
 * 바탕은 Screen이 알려준다(lib/useTheme.ts의 paintScreenBg).
 */
export const SCREEN_COLOR: Record<Theme, Record<ScreenBg, string>> = {
  light: { canvas: '#f2f5f7', primary: '#ffffff' },
  dark: { canvas: '#0d131b', primary: '#151c24' },
};

/**
 * 첫 페인트 전에 저장된 테마를 입히는 인라인 스크립트. <head>에서 HTML을 읽는 도중에 돈다.
 * 이게 없으면 다크를 고른 사용자도 하이드레이션까지 라이트 화면을 한 번 본다.
 *
 * theme-color meta는 이 스크립트보다 뒤에 올 수 있어 문서를 다 읽은 뒤에 고친다.
 * 여기서는 경로를 모르므로 캔버스 색을 넣는다 — 흰 바탕 화면을 바로 열었다면 하이드레이션
 * 직후 Screen이 primary로 고친다. 다크의 두 색 차이(0d131b·151c24)는 그동안 거의 안 보인다.
 * localStorage가 막힌 환경(시크릿 모드 등)에서는 조용히 기본값으로 둔다.
 */
export const THEME_SCRIPT = `(function(){try{if(localStorage.getItem(${JSON.stringify(THEME_KEY)})!=="dark")return;document.documentElement.setAttribute("data-theme","dark");document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute("content",${JSON.stringify(SCREEN_COLOR.dark.canvas)})})})}catch(e){}})()`;
