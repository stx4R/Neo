'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { readProfile, useProfile } from '@/lib/useProfile';

/**
 * 프로필이 없으면 어느 경로로 들어오든 /setup으로 보낸다.
 *
 * 화면마다 붙이지 않고 레이아웃에 한 번만 둔다 — 여섯 화면에 같은 검사를
 * 여섯 번 적으면 새 라우트를 만들 때마다 빠뜨린다.
 *
 * children을 감싸지 않고 형제로 둔다. 감싸서 프로필이 생길 때까지 null을
 * 렌더하면 정적 생성된 각 라우트의 HTML이 통째로 비고, 오프라인에서 캐시된
 * 문서를 열어도 흰 화면이 먼저 뜬다. 프로필은 모듈 로드 시점에 이미 읽혀 있으므로
 * 리다이렉트는 첫 커밋에서 걸린다.
 *
 * 판정은 렌더된 값이 아니라 readProfile()로 한다. useSyncExternalStore는
 * hydration 렌더에서 getServerSnapshot()(= null)을 쓰고, 이 이펙트는 그 커밋
 * 직후에 돈다. 렌더된 값을 믿으면 **프로필이 있는 사용자가 새로고침할 때마다**
 * /setup으로 튕긴다. readProfile()은 모듈 로드 때 localStorage에서 읽은 값이라
 * 클라이언트에서는 언제나 정확하다. useProfile()은 저장 직후 이펙트를 다시
 * 돌리기 위한 구독으로만 쓴다.
 */
export function ProfileGate() {
  const profile = useProfile();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (readProfile() === null && pathname !== '/setup') {
      router.replace('/setup');
    }
  }, [profile, pathname, router]);

  return null;
}
