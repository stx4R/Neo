import type { ReactNode } from 'react';

/**
 * 화면 프레임. 디자인 원본은 390×844 아트보드다.
 *   상단 44px  iOS 상태바 자리 (내용 없이 배경만)
 *   그 아래   스크롤 영역
 *   하단      탭바나 CTA 바가 겹쳐 앉는다
 *
 * 뷰포트가 390보다 넓으면 프레임 자체를 가운데 둔다.
 * 화면 '안'의 콘텐츠는 규칙대로 전부 좌측 정렬이다 — 프레임 배치와는 다른 얘기다.
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
        <div
          style={{
            position: 'absolute',
            top: 44,
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
