'use client';

import { IconButton } from '@/components/TopBar';
import { toggleLawSaved, useLawsSaved } from '@/lib/useLawsSaved';

/**
 * S3 우상단 저장 토글. 북마크 아이콘 — 저장되면 채운 브랜드색, 아니면 빈 윤곽.
 *
 * 페이지가 서버 컴포넌트라 여기만 클라이언트로 떼어냈다 —
 * `Affected` · `MustDoList` · `OpenActionsBar` · `HeaderBadge`와 같은 어법이다(§61).
 * 저장한 법령은 S2의 '저장됨' 칩이 모아 보여 준다.
 */
export function SaveToggle({ lawId }: { lawId: string }) {
  const saved = useLawsSaved();
  const on = saved.has(lawId);

  return (
    <IconButton
      icon="bookmark"
      label="저장"
      pressed={on}
      filled={on}
      color={on ? 'var(--tds-fg-brand)' : 'var(--tds-fg-primary)'}
      onClick={() => toggleLawSaved(lawId)}
    />
  );
}
