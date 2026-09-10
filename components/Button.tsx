import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

/**
 * 버튼. TDS 사이즈 사다리 — XL 56/16, M 40/12, S 36/12.
 * 눌림·비활성 상태는 globals.css의 .neo-btn이 맡는다(인라인으로는 :active를 못 쓴다).
 * 브랜드 면(primary)은 화면의 주 행동 하나에만 쓴다.
 */
export function Button({
  variant = 'primary',
  size = 'm',
  block = false,
  href,
  onClick,
  disabled = false,
  style,
  children,
}: {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'xl' | 'm' | 's';
  /** 가로를 꽉 채운다. 하단 CTA가 쓴다. */
  block?: boolean;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const className = `neo-btn neo-btn--${variant} neo-btn--${size}`;
  const s: CSSProperties = { ...(block ? { width: '100%' } : null), ...style };

  if (href) {
    return (
      <Link href={href} className={className} style={s}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={className} onClick={onClick} disabled={disabled} style={s}>
      {children}
    </button>
  );
}

/**
 * 화면 맨 아래 고정 CTA. 위로 보호 그라디언트를 깔아 스크롤되는 내용과 부딪치지
 * 않게 한다. 그라디언트는 Screen이 정한 화면 바탕(--veil)으로 끝난다.
 * 바닥에서 20px 뜨고, 홈 인디케이터가 그보다 크면 그만큼 올라간다.
 *
 * above는 버튼 바로 위에 얹히는 한 줄(경고)이다. 모달·시트로 만들지 않는다.
 */
export function BottomCTA({
  label,
  onPress,
  disabled = false,
  above,
}: {
  label: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  above?: ReactNode;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
        padding: '32px 16px var(--float-bottom)',
        background: 'var(--veil)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {above}
      <Button size="xl" block onClick={onPress} disabled={disabled}>
        {/* 한 덩어리로 감싼다. 버튼은 flex라 "미완 액션 ", 숫자, "건"이 따로 떨어지면
            그 사이마다 gap이 들어가 "2 건"처럼 벌어진다. */}
        <span>{label}</span>
      </Button>
    </div>
  );
}
