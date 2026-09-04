import type { ReactNode } from 'react';

/**
 * 색면 헤드라인. height 52, padding 0 14. H1을 색면 위에 얹는다.
 * 색면 위 글자는 언제나 --on-color.
 */
export function ColorBlock({
  tone,
  children,
}: {
  tone: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        height: 'var(--block-h)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--block-pad)',
        background: tone,
      }}
    >
      <h1 className="t-h1" style={{ margin: 0, color: 'var(--on-color)' }}>
        {children}
      </h1>
    </div>
  );
}
