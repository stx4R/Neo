'use client';

import type { CSSProperties, ReactNode } from 'react';
import { BottomCTA } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { ProgressBar } from '@/components/ProgressBar';
import { IconButton, TopBar } from '@/components/TopBar';

/**
 * /setup 전용 부품. 디자인 원본의 S7(SETUP 2/4 도착국)·S8(SETUP 4/4 회사·제품)에서 옮겼다.
 * 여기서만 쓰는 것은 여기 둔다.
 */

/**
 * 스텝 머리. 상단바(뒤로 + 진행 막대 + n/4) + 제목 + 부제.
 * 첫 실행의 첫 단계에는 돌아갈 곳이 없어 뒤로 버튼을 그리지 않는다.
 */
export function StepHead({
  step,
  total,
  title,
  hint,
  onBack,
}: {
  step: number;
  total: number;
  title: string;
  hint: string;
  onBack?: () => void;
}) {
  return (
    <>
      <TopBar
        inset={onBack ? 16 : 24}
        left={
          <>
            {onBack && <IconButton icon="chevron-left" label="이전 단계로" onClick={onBack} stroke={2} />}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                paddingRight: 12,
              }}
            >
              <ProgressBar value={step / total} height={4} label="설정 진행" style={{ flex: 1 }} />
              <span
                style={{
                  flex: 'none',
                  font: '600 12px/1 var(--font)',
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--tds-fg-tertiary)',
                }}
              >
                {step}/{total}
              </span>
            </div>
          </>
        }
      />

      <div style={{ padding: '12px var(--pad) 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1 className="t-h1">{title}</h1>
        <p className="t-body" style={{ color: 'var(--tds-fg-tertiary)' }}>
          {hint}
        </p>
      </div>
    </>
  );
}

/** 목록 한 묶음. 이름표가 있으면 카드 위에 단다(`지원 예정`). */
export function StepSection({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <section style={{ padding: '20px var(--pad) 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {label && (
        <h2 className="t-label" style={{ color: 'var(--tds-fg-quaternary)' }}>
          {label}
        </h2>
      )}
      {children}
    </section>
  );
}

/**
 * 선택 행. 카드(padding 6) 안에 선다.
 *
 * 고르면 라디오·체크박스가 아니라 행 자체가 브랜드 옅은 면으로 바뀌고 오른쪽에
 * 체크가 붙는다. 행 사이는 위 1px 선인데, 고른 행과 **바로 아래 행에는** 선이 없다 —
 * 둥근 색면의 모서리가 구분선을 대신한다. 그래서 `afterSelected`를 받는다.
 */
export function ChoiceRow({
  code,
  name,
  trailing,
  selected = false,
  afterSelected = false,
  first = false,
  disabled = false,
  onSelect,
}: {
  /** 국가 2글자 코드. 품목처럼 코드가 없는 목록에서는 넘기지 않는다. */
  code?: string;
  name: string;
  trailing?: ReactNode;
  selected?: boolean;
  /** 바로 위 행이 고른 행인가. 그렇다면 이 행의 위 선을 지운다. */
  afterSelected?: boolean;
  first?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}) {
  const style: CSSProperties = {
    width: '100%',
    // 최소 높이다 — 국가명이 길어져 두 줄이 되면 고정 높이는 흘러넘친다.
    minHeight: disabled ? 56 : 60,
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '0 14px',
    borderRadius: selected ? 'var(--r-l)' : undefined,
    background: selected ? 'var(--tds-bg-brand-weak)' : 'transparent',
    borderTop:
      first || selected || afterSelected ? undefined : '1px solid var(--tds-line-default)',
    opacity: disabled ? 0.45 : undefined,
    textAlign: 'left',
    cursor: disabled ? 'default' : 'pointer',
    transition: 'background-color var(--dur-base) var(--ease)',
  };

  const inner = (
    <>
      {code !== undefined && (
        <span
          style={{
            flex: 'none',
            width: 32,
            font: '700 13px/1 var(--font)',
            letterSpacing: '.06em',
            color: selected ? 'var(--tds-fg-brand)' : 'var(--tds-fg-quaternary)',
          }}
        >
          {code}
        </span>
      )}
      <span
        style={{
          flex: 1,
          minWidth: 0,
          font: `${selected ? 600 : 400} 17px/1.4 var(--font)`,
          color: selected
            ? 'var(--tds-fg-brand)'
            : disabled
              ? 'var(--tds-fg-secondary)'
              : 'var(--tds-fg-primary)',
        }}
      >
        {name}
      </span>
      {selected && (
        <Icon name="check" size={22} stroke={2.4} style={{ color: 'var(--tds-fg-brand)' }} />
      )}
      {trailing}
    </>
  );

  if (disabled) return <div style={style}>{inner}</div>;

  return (
    <button type="button" onClick={onSelect} aria-pressed={selected} style={style}>
      {inner}
    </button>
  );
}

/** 경고 한 줄이 CTA 위에 얹힐 때 더 비워 둘 높이. 알약 38 + 사이 10. */
export const WARNING_H = 48;

/**
 * 하단 고정 CTA. 국가·품목을 바꾸는 편집이면 버튼 위에 경고 알약 하나가 얹힌다.
 * 모달·시트로 만들지 않는다 — 누르기 전에 보여야 하는 말이다.
 * 비활성 CTA는 노드 전체가 흐려진다(.neo-btn:disabled).
 */
export function StepFooter({
  label,
  enabled,
  onPress,
  warning,
}: {
  label: string;
  enabled: boolean;
  onPress: () => void;
  warning?: string;
}) {
  return (
    <BottomCTA
      label={label}
      onPress={onPress}
      disabled={!enabled}
      above={
        warning && (
          <div
            role="status"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 'var(--r-full)',
              background: 'var(--risk-med-bg)',
              color: 'var(--risk-med-fg)',
            }}
          >
            <Icon name="triangle-alert" size={18} />
            <span style={{ font: '500 13px/1.4 var(--font)' }}>{warning}</span>
          </div>
        )
      }
    />
  );
}
