'use client';

import type { CSSProperties, ReactNode } from 'react';
import { OfflineBar } from '@/components/OfflineBar';
import { useOnline } from '@/lib/useOnline';

/**
 * 화면 바탕. 디자인 원본이 두 가지로 나눴다 —
 *   canvas   카드를 얹는 화면. S1 홈, S4 회사, 셋업
 *   primary  카드 없이 목록을 까는 화면. S2 규제, S3 상세, S5 지도, S6 알림
 */
const BG = {
  canvas: 'var(--tds-bg-canvas)',
  primary: 'var(--tds-bg-primary)',
} as const;

/**
 * 화면 프레임. 디자인 원본은 390×844 아트보드다.
 *   상단     기기 상태바 자리 (내용 없이 바탕만)
 *   그 아래   스크롤 영역
 *   하단      탭바나 CTA가 떠서 겹쳐 앉는다
 *
 * 상단 높이는 아트보드의 44px이 아니라 --safe-top이다. 없는 상태바를 44px로
 * 흉내 내면 브라우저에서 빈 띠가 남는다.
 *
 * 뷰포트가 --frame-max보다 넓으면 프레임 자체를 가운데 두고 바깥은 --board로 칠한다.
 *
 * 높이는 100dvh가 아니라 position: fixed + inset: 0으로 잡는다.
 * dvh는 '레이아웃 값'이라 iOS Safari가 하단 툴바를 접을 때 따라오지 않는다.
 * 이 앱은 문서가 스크롤되지 않으므로(html·body가 overflow: hidden) 툴바가 접혀도
 * 리레이아웃이 걸리지 않고, 프레임이 접히기 전 높이에 굳은 채 남는다.
 * fixed 요소는 브라우저가 툴바 상태에 맞춰 직접 옮겨 주므로 그 틈이 생기지 않는다.
 * 홈 화면 앱(standalone)만은 예외라 globals.css의 .neo-viewport가 받는다.
 *
 * 오프라인 바가 여기 있는 이유: 모든 화면이 Screen을 쓰므로 한 곳만 고치면 된다.
 * 바가 뜨면 스크롤 영역을 그만큼 아래로 민다 — 겹쳐서 상단바를 가리지 않는다.
 */
export function Screen({
  children,
  footer,
  scrollPadBottom,
  bg = 'primary',
}: {
  children: ReactNode;
  footer?: ReactNode;
  /**
   * 하단에 뜬 요소에 가리지 않도록 스크롤 안쪽에 두는 여백. CSS 길이다.
   * 화면마다 숫자를 적지 않는다 — globals.css의 --pad-tabbar / --pad-cta /
   * --pad-plain 셋 중 하나를 넘긴다.
   */
  scrollPadBottom: string;
  bg?: keyof typeof BG;
}) {
  const online = useOnline();

  return (
    <div
      className="neo-viewport"
      style={{ display: 'flex', justifyContent: 'center', background: 'var(--board)' }}
    >
      <div
        className="neo-frame"
        style={
          {
            position: 'relative',
            width: '100%',
            maxWidth: 'var(--frame-max)',
            height: '100%',
            overflow: 'hidden',
            '--screen-bg': BG[bg],
          } as CSSProperties
        }
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 'var(--safe-top)',
            zIndex: 6,
            background: 'var(--screen-bg)',
          }}
        />
        {!online && <OfflineBar />}
        <div
          style={{
            position: 'absolute',
            top: online ? 'var(--safe-top)' : 'calc(var(--safe-top) + var(--offline-h))',
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            // 끝까지 스크롤한 뒤 더 당겨도 문서로 넘어가지 않는다.
            overscrollBehavior: 'none',
          }}
        >
          <div style={{ paddingBottom: scrollPadBottom }}>{children}</div>
        </div>
        {footer}
      </div>
    </div>
  );
}

/**
 * 섹션. 제목(18/600) + 선택적인 오른쪽 액션 + 본문, 사이 10.
 * 섹션끼리의 간격은 화면이 정한다 — 디자인 원본이 화면마다 16·20을 따로 준다.
 */
export function Section({
  title,
  action,
  children,
}: {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <h2 className="t-title">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
