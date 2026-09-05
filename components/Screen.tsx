'use client';

import type { ReactNode } from 'react';
import { OfflineBar } from '@/components/OfflineBar';
import { useOnline } from '@/lib/useOnline';

/**
 * 화면 프레임. 디자인 원본은 390×844 아트보드다.
 *   상단 44px  iOS 상태바 자리 (내용 없이 배경만)
 *   그 아래   스크롤 영역
 *   하단      탭바나 CTA 바가 겹쳐 앉는다
 *
 * 뷰포트가 390보다 넓으면 프레임 자체를 가운데 둔다.
 * 화면 '안'의 콘텐츠는 규칙대로 전부 좌측 정렬이다 — 프레임 배치와는 다른 얘기다.
 *
 * 오프라인 바가 여기 있는 이유: 여섯 화면이 전부 Screen을 쓰므로 한 곳만 고치면 된다.
 * 바가 뜨면 스크롤 영역을 그만큼 아래로 민다 — 겹쳐서 상단바를 가리지 않는다.
 * 그래서 'use client'가 붙는다. 페이지들은 이미 전부 클라이언트다.
 */
export function Screen({
  children,
  footer,
  /** 하단 고정 요소에 가리지 않도록 스크롤 안쪽에 두는 여백. 화면마다 다르다. */
  scrollPadBottom,
}: {
  children: ReactNode;
  footer?: ReactNode;
  scrollPadBottom: number;
}) {
  const online = useOnline();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--bg)' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 390,
          height: '100dvh',
          overflow: 'hidden',
          background: 'var(--bg)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 44,
            zIndex: 6,
            background: 'var(--bg)',
          }}
        />
        {!online && <OfflineBar />}
        <div
          style={{
            position: 'absolute',
            // 바 높이는 --badge-h 하나에서 온다. 44 + 22 를 따로 적지 않는다.
            top: online ? 44 : 'calc(44px + var(--badge-h))',
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div style={{ paddingBottom: scrollPadBottom }}>{children}</div>
        </div>
        {footer}
      </div>
    </div>
  );
}

/** 섹션. 라벨 + margin-top 12 본문. 섹션 간격은 28. */
export function Section({
  label,
  children,
  first = false,
}: {
  label: string;
  children: ReactNode;
  /** 첫 섹션이면 위 간격을 다르게 줄 때 쓴다. */
  first?: boolean;
}) {
  return (
    <section
      style={{
        marginTop: first ? undefined : 'var(--sec-gap)',
        padding: '0 var(--pad)',
      }}
    >
      <span className="t-label" style={{ display: 'block', color: 'var(--text-3)' }}>
        {label}
      </span>
      <div style={{ marginTop: 'var(--lbl-gap)' }}>{children}</div>
    </section>
  );
}
