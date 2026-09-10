import { Icon } from '@/components/Icon';

/**
 * 입력칸. 48px, radius 12, 회색 면. 누르면 흰 면 + 1.5px 브랜드 선으로 바뀌고,
 * 틀리면 1.5px 빨간 선이 남는다. 그 전환은 globals.css의 .neo-field가 한다 —
 * :focus-within은 인라인으로 못 쓴다.
 */
export function TextField({
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
  /** 고정폭이 필요한 칸(HS코드 104px)에만 넘긴다. 없으면 남는 폭을 다 쓴다. */
  width?: number;
  tnum?: boolean;
  inputMode?: 'numeric';
  maxLength?: number;
}) {
  return (
    <div
      className="neo-field"
      data-invalid={invalid || undefined}
      // basis는 auto다. `flex: 1`(basis 0)을 주면 세로 flex 안에서 높이 48을 덮어써
      // 칸이 글자 한 줄 높이로 납작해진다(셋업 4단계 회사명 칸).
      style={{ flex: width ? 'none' : '1 1 auto', minWidth: 0, width }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        inputMode={inputMode}
        maxLength={maxLength}
        // .neo-field input의 font 단축속성이 숫자 폭을 되돌리므로 인라인으로 준다.
        style={tnum ? { fontVariantNumeric: 'tabular-nums' } : undefined}
      />
    </div>
  );
}

/** 검색칸. 입력칸 왼쪽에 돋보기가 붙는다. S2 규제 검색, S5 국가 검색. */
export function SearchField({
  value,
  onChange,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  ariaLabel: string;
}) {
  return (
    <div className="neo-field">
      <Icon name="search" size={20} style={{ color: 'var(--tds-fg-quaternary)' }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        enterKeyHint="search"
      />
    </div>
  );
}
