'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/Checkbox';
import { Row, RowMeta } from '@/components/Row';
import { formatMonthDay } from '@/lib/dday';
import type { Action } from '@/types/neo';

/**
 * S3 체크리스트.
 *
 * 완료 상태를 여기서 useState로 들고 있는 건 임시다. 6단계에서 useActionState로
 * 갈아끼운다 — 그때 바꿀 곳은 이 훅 한 줄뿐이고, ActionRow는 손대지 않는다.
 */
export function MustDoList({ actions }: { actions: Action[] }) {
  // TODO 6단계: localStorage 기반 useActionState로 교체. S1과 같은 출처를 봐야 한다.
  const [done, setDone] = useState<readonly string[]>([]);

  const toggle = (id: string) =>
    setDone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <>
      {actions.map((action, i) => (
        <ActionRow
          key={action.id}
          action={action}
          done={done.includes(action.id)}
          onToggle={() => toggle(action.id)}
          last={i === actions.length - 1}
        />
      ))}
    </>
  );
}

function ActionRow({
  action,
  done,
  onToggle,
  last,
}: {
  action: Action;
  done: boolean;
  onToggle: () => void;
  last: boolean;
}) {
  // "품질팀 · 2주 · ~10.15" — 마감이 없으면 뒤 칸을 붙이지 않는다.
  const meta = [action.owner, action.effort]
    .concat(action.dueDate ? [`~${formatMonthDay(action.dueDate)}`] : [])
    .join(' · ');

  return (
    <Row
      height="action"
      leading={<Checkbox checked={done} onChange={onToggle} label={action.title} />}
      leadingAlign="top"
      last={last}
    >
      <span
        className="t-body"
        style={{
          color: done ? 'var(--text-3)' : 'var(--text)',
          textDecoration: done ? 'line-through' : undefined,
        }}
      >
        {action.title}
      </span>
      <RowMeta>{meta}</RowMeta>
    </Row>
  );
}
