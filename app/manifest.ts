import type { MetadataRoute } from 'next';

/**
 * public/manifest.json이 아니라 metadata route로 쓴다 — 타입 검사가 붙고
 * layout.tsx의 metadata와 한곳에서 관리된다.
 *
 * 산출 URL은 /manifest.webmanifest 다. public/sw.js의 프리캐시 목록도 그 URL을 쓴다.
 *
 * 색은 layout.tsx의 viewport.themeColor와 같은 리터럴이다 — 매니페스트는 CSS가
 * 아니라 var()를 쓸 수 없고, 이미 두 곳뿐이라 세 번째 출처를 만들지 않는다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NEO',
    short_name: 'NEO',
    description: '해외 수출 규제 대응',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#171717',
    theme_color: '#171717',
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
