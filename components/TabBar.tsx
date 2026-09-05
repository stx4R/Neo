'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * 하단 탭바. 텍스트 4개, 아이콘 없음.
 * 활성 탭은 상단에 2px --accent 색면 한 줄.
 *
 * 탭 라벨만은 가운데 정렬이다 — 디자인 원본이 justify-content:center 로 그려져 있다.
 * "전부 좌측 정렬" 규칙은 화면 콘텐츠에 적용되고 탭바에는 적용되지 않는다.
 *
 * 하단 여백은 iOS 홈 인디케이터 자리다. 아트보드 실측 34px이 아니라 --safe-bottom을
 * 쓴다 — 기기가 알려주는 값이라야 인디케이터가 탭 라벨을 가리지 않는다.
 */
const TABS = [
  { href: '/', label: 'HOME' },
  { href: '/laws', label: 'LAWS' },
  { href: '/company', label: 'COMPANY' },
  { href: '/map', label: 'MAP' },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
        paddingBottom: 'var(--safe-bottom)',
        background: 'var(--bg)',
        borderTop: '1px solid var(--hairline)',
      }}
    >
      <div style={{ height: 64, display: 'flex', alignItems: 'stretch' }}>
        {TABS.map(({ href, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className="t-label"
              style={{
                position: 'relative',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: active ? 'var(--text)' : 'var(--text-3)',
                textDecoration: 'none',
              }}
            >
              {active && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: 'var(--accent)',
                  }}
                />
              )}
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
