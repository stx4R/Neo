'use client';

import { Icon } from '@/components/Icon';

/**
 * 체크박스. 22px, radius 6.
 * 빈 칸은 흰 면 + 1.5px line-strong, 체크하면 브랜드 면 + 흰 체크로 뒤집는다.
 * 시각 크기는 디자인 값 그대로 두고 히트 영역만 44px로 넓힌다(.tap).
 */
export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** 스크린리더용. 화면에는 나오지 않는다. */
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="tap"
      style={{
        flex: 'none',
        width: 22,
        height: 22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        borderRadius: 'var(--r-badge)',
        border: checked ? '1.5px solid var(--tds-bg-brand)' : '1.5px solid var(--tds-line-strong)',
        background: checked ? 'var(--tds-bg-brand)' : 'var(--tds-bg-primary)',
        color: 'var(--tds-fg-inverse)',
        cursor: 'pointer',
        transition: 'background-color var(--dur-base) var(--ease), border-color var(--dur-base) var(--ease)',
      }}
    >
      {checked && <Icon name="check" size={14} stroke={3} />}
    </button>
  );
}
