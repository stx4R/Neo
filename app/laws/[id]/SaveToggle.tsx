'use client';

import { toggleLawSaved, useLawsSaved } from '@/lib/useLawsSaved';

/**
 * S3 우상단 저장 토글.
 *
 * 페이지가 서버 컴포넌트라 여기만 클라이언트로 떼어냈다 —
 * `Affected` · `MustDoList` · `OpenActionsBar` · `HeaderBadge`와 같은 어법이다(§61).
 *
 * 상태를 색으로만 말한다. 저장되면 `--accent`, 아니면 `--text-3`이다.
 * 아이콘이나 채워진 별을 쓰지 않는 이유: 이 앱에 아이콘이 없고(이모지 금지),
 * 글자 하나가 색으로 상태를 말하는 것이 화면의 다른 라벨들과 같은 어법이다.
 */
export function SaveToggle({ lawId }: { lawId: string }) {
  const saved = useLawsSaved();
  const on = saved.has(lawId);

  return (
    <button
      type="button"
      onClick={() => toggleLawSaved(lawId)}
      aria-pressed={on}
      className="t-meta"
      style={{
        // 터치 타겟 44px. 글자는 우측 끝에 맞추고 여백으로 넓힌다.
        minHeight: 44,
        padding: '0 0 0 16px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: on ? 'var(--accent)' : 'var(--text-3)',
      }}
    >
      {on ? '저장됨' : '저장'}
    </button>
  );
}
