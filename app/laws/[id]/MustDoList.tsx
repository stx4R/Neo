'use client';

import { Checkbox } from '@/components/Checkbox';
import { Row, RowMeta } from '@/components/Row';
import { formatMonthDay } from '@/lib/dday';
import { toggleAction, useActionsDone } from '@/lib/useActionsDone';
import type { Action } from '@/types/neo';

/**
 * S3 체크리스트.
 * 완료 상태는 S1·S2와 같은 스토어에서 온다. ActionRow는 상태를 들지 않는다.
 */
export function MustDoList({ actions }: { actions: Action[] }) {
  const done = useActionsDone();

  return (
    <>
      {actions.map((action, i) => (
        <ActionRow
          key={action.id}
          action={action}
          done={done.has(action.id)}
          onToggle={() => toggleAction(action.id)}
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
