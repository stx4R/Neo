'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/Icon';

/**
 * 하단 탭바. 바닥에 붙지 않고 떠 있는 둥근 막대다 — 좌우 16, 바닥에서 20,
 * 높이 64, radius 24. 홈 인디케이터가 20보다 크면 그만큼 올라간다(--float-bottom).
 *
 * 활성 탭은 글자색(fg-primary) + 굵은 선, 나머지는 fg-quaternary.
 * 탭 아이콘과 라벨만은 가운데 정렬이다.
 *
 * 뒤에 120px 보호 그라디언트(veil)를 깐다. 탭바 둘레로 스크롤되는 글자가
 * 비치지 않게 한다. S5처럼 시트가 이미 바닥을 덮는 화면에서는 끈다 —
 * 다크 테마에서 시트 면(elevated) 위에 화면 바탕색 띠가 생긴다.
 */
const TABS: readonly { href: string; label: string; icon: IconName }[] = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/laws', label: '규제', icon: 'scroll' },
  { href: '/company', label: '회사', icon: 'building' },
  { href: '/map', label: '지도', icon: 'map' },
];

export function TabBar({ veil = true }: { veil?: boolean }) {
  const pathname = usePathname();

  return (
    <>
      {veil && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 'calc(var(--float-bottom) + 100px)',
            zIndex: 5,
            background: 'var(--veil)',
            pointerEvents: 'none',
          }}
        />
      )}
      <nav
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 'var(--float-bottom)',
          zIndex: 5,
          height: 'var(--tabbar-h)',
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: 'var(--r-sheet)',
          background: 'var(--tds-bg-elevated)',
          border: '1px solid var(--tds-line-default)',
          boxShadow: 'var(--shadow-2)',
        }}
      >
        {TABS.map(({ href, label, icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                color: active ? 'var(--tds-fg-primary)' : 'var(--tds-fg-quaternary)',
                textDecoration: 'none',
              }}
            >
              <Icon name={icon} stroke={active ? 2.2 : 1.75} />
              <span style={{ font: `${active ? 600 : 500} 11px/1 var(--font)` }}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
