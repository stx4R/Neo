'use client';

import { useEffect } from 'react';
import { laws } from '@/lib/data';

/**
 * 서비스워커 등록. 프로덕션에서만 한다 — dev에서 등록하면 Turbopack HMR과 캐시가 싸운다.
 *
 * 프리캐시할 라우트를 서비스워커에 알려주는 자리이기도 하다. public/sw.js는 정적 파일이라
 * data/laws.json을 임포트할 수 없고, 법률 5건의 id를 거기 박으면 파생값 원칙이 깨진다.
 * 법률이 늘면 이 목록도 같이 늘어난다.
 */

/**
 * 탭바 4개 + 알림 + 온보딩. 아트보드의 6화면 중 법률 상세만 파생이다.
 * /setup이 빠지면 프로필 없는 사용자가 오프라인에서 앱을 아예 못 연다 —
 * 어느 경로로 들어오든 거기로 보내지기 때문이다.
 */
const STATIC_ROUTES = ['/', '/laws', '/company', '/map', '/notifications', '/setup'];

export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    const urls = [...STATIC_ROUTES, ...laws.map((law) => `/laws/${law.id}`)];

    const send = () => {
      navigator.serviceWorker.controller?.postMessage({
        type: 'neo:precache-routes',
        urls,
      });
    };

    navigator.serviceWorker
      .register('/sw.js')
      .then(() => navigator.serviceWorker.ready)
      .then(() => {
        // 이미 제어 중이면 지금 보낸다. 첫 방문은 controller가 아직 null이라
        // 아무 일도 일어나지 않고, 아래 controllerchange가 받는다.
        send();
        // 제어권이 넘어올 때마다 다시 보낸다. once로 두면 안 된다 —
        // 버전을 올린 직후의 로드에서 옛 워커에게 보내고 끝나면
        // 새 셸에 라우트가 비어 있게 된다. 같은 URL을 다시 담는 것은 무해하다.
        navigator.serviceWorker.addEventListener('controllerchange', send);
      })
      .catch((err) => {
        console.warn('서비스워커 등록 실패', err);
      });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', send);
    };
  }, []);

  return null;
}
