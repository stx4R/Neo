'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useProfile } from '@/lib/useProfile';

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
 */
export function ProfileGate() {
  const profile = useProfile();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (profile === null && pathname !== '/setup') {
      router.replace('/setup');
    }
  }, [profile, pathname, router]);

  return null;
}
