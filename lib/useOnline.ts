'use client';

import { useSyncExternalStore } from 'react';

/**
 * 온라인 여부. navigator.onLine 과 online/offline 이벤트뿐이다.
 * 서비스워커와 실제 캐시는 11단계다 — 여기서는 연결 상태만 본다.
 *
 * getServerSnapshot이 언제나 true인 이유: 서버는 navigator를 모른다.
 * 서버에서 오프라인이라고 그려 두면 하이드레이션 불일치가 난다.
 * 오프라인으로 시작한 경우에도 하이드레이션 직후 스냅샷 검사에서 바가 뜬다 —
 * 첫 페인트에 한 프레임 늦는 대신 경고를 만들지 않는다.
 *
 * 렌더마다 새 함수를 넘기면 재구독하므로 subscribe·getSnapshot을 모듈에 고정한다.
 */

function subscribe(listener: () => void): () => void {
  window.addEventListener('online', listener);
  window.addEventListener('offline', listener);
  return () => {
    window.removeEventListener('online', listener);
    window.removeEventListener('offline', listener);
  };
}

const getSnapshot = () => navigator.onLine;
const getServerSnapshot = () => true;

export function useOnline(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
