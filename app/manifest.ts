import type { MetadataRoute } from 'next';
import { SCREEN_COLOR } from '@/lib/theme';

/**
 * public/manifest.json이 아니라 metadata route로 쓴다 — 타입 검사가 붙고
 * layout.tsx의 metadata와 한곳에서 관리된다.
 *
 * 산출 URL은 /manifest.webmanifest 다. public/sw.js의 프리캐시 목록도 그 URL을 쓴다.
 *
 * 색은 기본 테마(라이트)의 화면 바탕이다. 매니페스트는 설치할 때 한 번 읽히고
 * 테마 버튼을 따라 바뀌지 않으므로 스플래시는 라이트 하나로 둔다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NEO',
    short_name: 'NEO',
    description: '해외 수출 규제 대응',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: SCREEN_COLOR.light.canvas,
    theme_color: SCREEN_COLOR.light.canvas,
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
