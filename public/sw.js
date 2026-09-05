/**
 * NEO 서비스워커.
 *
 * Serwist를 쓰지 않는다 — 4단계 판정. 필요한 건 셸 프리캐시와 몇 종류의 런타임 캐싱뿐이라
 * 번들러에 묶이지 않는 정적 파일 하나로 끝난다.
 *
 * 계획서 §9의 "data/*.json을 stale-while-revalidate"는 성립하지 않는다. 그 JSON은
 * lib/data.ts가 정적으로 임포트해 JS 청크 안에 들어 있고 독립된 URL이 없다.
 * 캐싱 대상은 실제로 URL을 갖는 것뿐이다.
 *
 * 빌드 산출물 프리캐시 매니페스트도 만들지 않는다. 해시 파일명을 알려면 빌드 훅이
 * 필요한데, /_next/static/* 은 해시가 붙어 불변이므로 cache-first 런타임 캐싱으로 충분하다.
 */

const VERSION = 'v2';
const SHELL_CACHE = `neo-${VERSION}`;
const RSC_CACHE = `neo-${VERSION}-rsc`;
const KEEP = [SHELL_CACHE, RSC_CACHE];

/** install에서 받는 것 — URL이 고정된 것만이다. 라우트는 앱이 따로 알려준다. */
const SHELL = [
  '/manifest.webmanifest',
  '/favicon.ico',
  '/geo/land-110m.json',
  '/fonts/Pretendard-Regular.subset.woff2',
  '/fonts/Pretendard-Medium.subset.woff2',
  '/fonts/Pretendard-Bold.subset.woff2',
  '/fonts/neo-mark-65BD.woff2',
  '/fonts/neo-mark-7559.woff2',
  '/fonts/neo-mark-8C6B.woff2',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon-180.png',
];

/** 해시가 붙었거나 내용이 고정된 것들. 한 번 받으면 다시 묻지 않는다. */
const CACHE_FIRST = [/^\/_next\/static\//, /^\/fonts\//, /^\/geo\//, /^\/icons\//];

function isCacheFirst(pathname) {
  if (pathname === '/manifest.webmanifest' || pathname === '/favicon.ico') return true;
  return CACHE_FIRST.some((re) => re.test(pathname));
}

/**
 * 클라이언트 내비게이션은 문서가 아니라 RSC 페이로드를 받는다.
 * 쿼리(`?_rsc=`)의 해시가 빌드마다 달라지므로 URL 완전 일치로는 찾을 수 없다.
 */
function isRsc(request) {
  if (request.headers.get('RSC') === '1') return true;
  return new URL(request.url).searchParams.has('_rsc');
}

function isDocument(request) {
  if (request.mode === 'navigate' || request.destination === 'document') return true;
  return (request.headers.get('Accept') || '').includes('text/html');
}

self.addEventListener('install', (event) => {
  event.waitUntil(install());
});

async function install() {
  const cache = await caches.open(SHELL_CACHE);
  // addAll은 하나만 실패해도 전부 버린다. 아이콘 하나 때문에 설치가 통째로
  // 실패하면 오프라인이 아예 안 되므로 개별로 담고 실패는 남기기만 한다.
  await Promise.all(
    SHELL.map((url) =>
      cache
        .add(new Request(url, { cache: 'reload' }))
        .catch((err) => console.warn('[sw] 프리캐시 실패', url, err)),
    ),
  );
  await self.skipWaiting();
}

self.addEventListener('activate', (event) => {
  event.waitUntil(activate());
});

async function activate() {
  const names = await caches.keys();
  // 버전을 올리면 옛 셸이 통째로 사라진다. 섞여 남지 않는다.
  await Promise.all(names.filter((n) => !KEEP.includes(n)).map((n) => caches.delete(n)));
  await self.clients.claim();
}

/**
 * 프리캐시할 라우트는 앱이 알려준다.
 *
 * 이 파일은 정적이라 data/laws.json을 임포트할 수 없고, 법률 5건의 id를 여기 박으면
 * 파생값 원칙이 깨진다. components/ServiceWorker.tsx가 lib/data의 laws에서 URL을
 * 만들어 postMessage로 넘긴다.
 */
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'neo:precache-routes' || !Array.isArray(data.urls)) return;
  event.waitUntil(precacheRoutes(data.urls.filter((u) => typeof u === 'string')));
});

async function precacheRoutes(urls) {
  const [shell, rsc] = await Promise.all([caches.open(SHELL_CACHE), caches.open(RSC_CACHE)]);
  await Promise.all(
    urls.map(async (url) => {
      const key = new URL(url, self.location.origin).pathname;
      // 문서와 RSC 페이로드를 둘 다 받는다. 문서만 담으면 오프라인에서
      // 탭을 눌렀을 때 라우터가 RSC를 못 받아 아무 일도 일어나지 않는다 —
      // 하드 내비게이션으로 떨어지지도 않고 그냥 멈춘다.
      await Promise.all([
        // Accept를 명시해 RSC가 아니라 문서를 받는다.
        put(shell, key, new Request(url, { cache: 'reload', headers: { Accept: 'text/html' } })),
        // 브라우저는 `?_rsc=<해시>`로 요청하지만 해시는 빌드마다 다르다.
        // 쿼리 없는 `?_rsc`가 같은 페이로드를 주고, 키는 경로만 쓰므로 맞는다.
        put(rsc, key, new Request(`${url}?_rsc`, { cache: 'reload', headers: { RSC: '1' } })),
      ]);
    }),
  );
}

async function put(cache, key, request) {
  try {
    const response = await fetch(request);
    if (response.ok && !response.redirected) await cache.put(key, response);
  } catch (err) {
    console.warn('[sw] 프리캐시 실패', request.url, err);
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 문서와 RSC를 다른 캐시에 담는다. 같은 캐시에 넣고 ignoreSearch로 찾으면
  // `/laws` 문서와 `/laws?_rsc=…` 페이로드가 서로를 물어 온다.
  if (isRsc(request)) {
    event.respondWith(networkFirst(request, RSC_CACHE, url.pathname));
    return;
  }
  if (isDocument(request)) {
    event.respondWith(networkFirst(request, SHELL_CACHE, url.pathname));
    return;
  }
  if (isCacheFirst(url.pathname)) {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
    return;
  }
  // 그 외는 그대로 통과시킨다.
});

/** 키는 쿼리를 뗀 경로다. 빌드마다 바뀌는 해시에 캐시가 매이지 않는다. */
async function networkFirst(request, cacheName, key) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok && !response.redirected) cache.put(key, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(key, { ignoreSearch: true });
    if (cached) return cached;
    // 오프라인 폴백 화면을 새로 만들지 않는다 — 라우트를 전부 프리캐시하므로
    // 여기까지 오는 건 앱이 모르는 주소뿐이고, 그건 그냥 실패해야 맞다.
    throw err;
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && !response.redirected) cache.put(request, response.clone());
  return response;
}
