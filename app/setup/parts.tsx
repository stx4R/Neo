'use client';

import type { ReactNode } from 'react';

/**
 * /setup 전용 원자들. 아트보드 `design/NEO Setup v4.dc.html`의 S7·S8에서 실측했다.
 *
 * 기존 6화면의 Row를 쓰지 않는 이유: S7의 선택 행은 좌우 패딩 밖으로 나가는
 * 풀블리드 색면이고, 위아래 헤어라인을 스스로 지운다. Row에 그 분기를 넣으면
 * 여섯 화면이 쓰지 않는 조건이 Row 안에 남는다. 여기서만 쓰는 것은 여기 둔다.
 */

/**
 * 스텝 머리. 상단바(뒤로 + 진행률) + 제목 + 부제.
 *
 * 진행률은 우측 Meta 텍스트 하나뿐이다 — 진행률 바를 만들지 않는다.
 * `←`는 아트보드가 `400 20px/1`로 그렸다. S3·S6에 이미 같은 값이 쓰이고 있어
 * 그대로 맞춘다(DISCREPANCIES §40).
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
      <div
        style={{
          height: 'var(--topbar)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--pad)',
        }}
      >
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="이전 단계로"
            style={{
              // 44px 터치 타겟을 확보하되 글리프는 아트보드 위치에 남긴다.
              width: 44,
              height: 44,
              margin: '0 0 0 -12px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              border: 'none',
              background: 'transparent',
              font: '400 20px/1 Pretendard, sans-serif',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            <span style={{ marginLeft: 12 }}>←</span>
          </button>
        ) : (
          <span />
        )}
        <span className="t-meta tnum" style={{ color: 'var(--text-3)' }}>
          {step}/{total}
        </span>
      </div>

      <div style={{ padding: '12px var(--pad) 0' }}>
        <h1 className="t-h1" style={{ margin: 0, color: 'var(--text)' }}>
          {title}
        </h1>
        <p className="t-meta" style={{ margin: '10px 0 0', color: 'var(--text-3)' }}>
          {hint}
        </p>
      </div>
    </>
  );
}

/**
 * 라벨 + 목록 섹션. 기존 Screen의 Section과 값은 같지만 마지막 행에
 * border-bottom이 붙는다는 점이 다르다. /setup은 그룹이 연달아 두 개라
 * 닫는 선이 없으면 두 그룹이 붙어 보인다. 여기서만 허용하는 예외다
 * (DISCREPANCIES §41). 기존 화면에 소급하지 않는다.
 */
export function StepSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 'var(--sec-gap)', padding: '0 var(--pad)' }}>
      <span className="t-label" style={{ display: 'block', color: 'var(--text-3)' }}>
        {label}
      </span>
      <div style={{ marginTop: 'var(--lbl-gap)' }}>{children}</div>
    </section>
  );
}

/**
 * S7 선택 행.
 *
 * 선택되면 라디오·체크박스가 아니라 행 자체가 색면으로 반전된다.
 * 색면은 좌우 패딩 밖까지 나가는 풀블리드다 — 패딩 안쪽만 채우면 선택하는 순간
 * 글자가 밀려 보인다.
 *
 * 헤어라인 처리가 이 부품의 핵심이다. 아트보드 S7-B를 보면 색면 행에도,
 * **바로 아래 행에도** border-top이 없다. 색면 블록의 아래 모서리가 구분선을
 * 대신하기 때문이다. 그래서 `afterSelected`를 받는다.
 */
export function ChoiceRow({
  code,
  name,
  trailing,
  selected = false,
  afterSelected = false,
  last = false,
  disabled = false,
  onSelect,
}: {
  /** 국가 2글자 코드. 품목처럼 코드가 없는 목록에서는 넘기지 않는다. */
  code?: string;
  name: string;
  trailing?: ReactNode;
  selected?: boolean;
  /** 바로 위 행이 선택된 색면인가. 그렇다면 이 행의 border-top을 지운다. */
  afterSelected?: boolean;
  last?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}) {
  const inner = (
    <>
      {code !== undefined && (
        <span
          className="t-label tnum"
          style={{
            flex: 'none',
            width: 'var(--code-w)',
            color: selected ? 'var(--on-color)' : 'var(--text-3)',
          }}
        >
          {code}
        </span>
      )}
      <span
        className="t-body"
        style={{
          flex: 1,
          minWidth: 0,
          color: selected
            ? 'var(--on-color)'
            : disabled
              ? 'var(--text-3)'
              : 'var(--text)',
        }}
      >
        {name}
      </span>
      {trailing}
    </>
  );

  const style: React.CSSProperties = {
    // 버튼은 width: auto가 shrink-to-fit이다 — 내용만큼만 넓어져서 색면도
    // 헤어라인도 글자 뒤에서 끊긴다. 폭을 직접 준다.
    // 선택 행은 좌우 패딩 밖까지 나가야 하므로 패딩 두 배만큼 더 넓다.
    width: selected ? 'calc(100% + var(--pad) * 2)' : '100%',
    // Row와 같은 이유로 최소 높이다 — 국가명이 길어져 두 줄이 되면 고정 높이는 흘러넘친다.
    minHeight: 'var(--row-info)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--row-gap)',
    border: 'none',
    textAlign: 'left',
    background: selected ? 'var(--accent)' : 'transparent',
    // 색면은 풀블리드다. 좌우 패딩을 음수 마진으로 뚫고 같은 값을 패딩으로 되돌린다.
    margin: selected ? '0 calc(var(--pad) * -1)' : undefined,
    padding: selected ? '0 var(--pad)' : 0,
    borderTop: selected || afterSelected ? undefined : '1px solid var(--hairline)',
    borderBottom: last && !selected ? '1px solid var(--hairline)' : undefined,
    cursor: disabled ? 'default' : 'pointer',
  };

  if (disabled) {
    return <div style={{ ...style, cursor: 'default' }}>{inner}</div>;
  }

  return (
    <button type="button" onClick={onSelect} aria-pressed={selected} style={style}>
      {inner}
    </button>
  );
}

/**
 * S8 입력 필드. 박스가 아니라 아래 선 하나다. height 44.
 *
 * 포커스는 선 색과 caret 색만 바꾼다 — 그 외에는 아무 변화도 없다.
 * 오류는 무채색 안(S8-B 확정)이다: 선 --text, 메시지 --text-2.
 * 위험도 색을 쓰지 않는다 — 위험도 색은 위험도 표현에만 쓴다.
 */
export function Field({
  value,
  onChange,
  placeholder,
  ariaLabel,
  invalid = false,
  width,
  tnum = false,
  inputMode,
  maxLength,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  ariaLabel: string;
  invalid?: boolean;
  /** 고정폭이 필요한 칸(HS코드 88px)에만 넘긴다. */
  width?: string;
  tnum?: boolean;
  inputMode?: 'numeric';
  maxLength?: number;
}) {
  return (
    <div
      style={{
        flex: width ? 'none' : 1,
        minWidth: 0,
        width,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${invalid ? 'var(--text)' : 'var(--hairline)'}`,
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        inputMode={inputMode}
        maxLength={maxLength}
        className={tnum ? 't-body tnum' : 't-body'}
        style={{
          width: '100%',
          minWidth: 0,
          padding: 0,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: 'var(--text)',
          caretColor: 'var(--accent)',
        }}
      />
    </div>
  );
}

/** 하단 고정 바. 탭바·S3 CTA와 같은 규칙 — bottom 0, 안전영역은 패딩으로만. */
export function StepFooter({
  label,
  enabled,
  onPress,
  warning,
}: {
  label: string;
  enabled: boolean;
  onPress: () => void;
  /** 있으면 바 위에 색면 블록 하나가 인라인으로 얹힌다. 모달·시트로 만들지 않는다. */
  warning?: string;
}) {
  return (
    <>
      {warning && (
        <div
          role="status"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 'calc(var(--ctabar-h) + var(--safe-bottom))',
            zIndex: 5,
            height: 'var(--block-h)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 var(--pad)',
            background: 'var(--risk-medium)',
          }}
        >
          <span className="t-body" style={{ color: 'var(--on-color)' }}>
            {warning}
          </span>
        </div>
      )}
      <div
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
        <div
          style={{
            height: 'var(--ctabar-cell)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 var(--pad)',
          }}
        >
          <button
            type="button"
            onClick={onPress}
            disabled={!enabled}
            style={{
              width: '100%',
              height: 44,
              display: 'flex',
              alignItems: 'center',
              padding: '0 var(--block-pad)',
              border: 'none',
              background: enabled ? 'var(--accent)' : 'var(--surface)',
              cursor: enabled ? 'pointer' : 'default',
            }}
          >
            <span
              className="t-h2"
              style={{ color: enabled ? 'var(--on-color)' : 'var(--text-3)' }}
            >
              {label}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
