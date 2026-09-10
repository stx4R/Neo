'use client';

import { Card } from '@/components/Card';
import { Checkbox } from '@/components/Checkbox';
import { Row } from '@/components/Row';
import { Section } from '@/components/Screen';
import { useDataset } from '@/lib/dataset';
import { formatMonthDay } from '@/lib/dday';
import { actionsOfLaw } from '@/lib/derive';
import { toggleAction, useActionsDone } from '@/lib/useActionsDone';
import type { Action, Law } from '@/types/neo';

/**
 * S3 체크리스트. 섹션 제목까지 여기서 그린다.
 *
 * 액션 목록을 서버에서 받지 않고 데이터셋에서 뽑는 이유: 공용 법령은 액션이
 * 품목별로 갈린다(`Action.itemCategories`). 서버는 사용자의 품목을 모른다 —
 * 프로필이 localStorage에 있기 때문이다. 그대로 두면 화장품 사용자의 라벨 시행령
 * 화면에 "영양성분 베트남어 표기"가 섞인다.
 *
 * 완료 상태는 S1·S2와 같은 스토어에서 온다. ActionRow는 상태를 들지 않는다.
 */
export function MustDoList({ law }: { law: Law }) {
  const done = useActionsDone();
  const ds = useDataset();
  const actions = ds ? actionsOfLaw(ds, law) : [];

  // 이 조합에서 이 법령에 걸린 액션이 없으면 섹션 자체를 그리지 않는다.
  if (actions.length === 0) return null;

  return (
    <Section
      title={
        <>
          해야 할 일{' '}
          <span className="tnum" style={{ color: 'var(--tds-fg-brand)' }}>
            {actions.length}
          </span>
        </>
      }
    >
      <Card>
        {actions.map((action, i) => (
          <ActionRow
            key={action.id}
            action={action}
            done={done.has(action.id)}
            onToggle={() => toggleAction(action.id)}
            divider={i < actions.length - 1}
          />
        ))}
      </Card>
    </Section>
  );
}

function ActionRow({
  action,
  done,
  onToggle,
  divider,
}: {
  action: Action;
  done: boolean;
  onToggle: () => void;
  divider: boolean;
}) {
  // "품질팀 · 2주 · ~10.15" — 마감이 없으면 뒤 칸을 붙이지 않는다.
  const meta = [action.owner, action.effort]
    .concat(action.dueDate ? [`~${formatMonthDay(action.dueDate)}`] : [])
    .join(' · ');

  return (
    <Row
      align="start"
      divider={divider}
      leading={
        // 체크박스를 첫 줄 글자 가운데에 맞춘다(22px 상자, 22.5px 줄).
        <span style={{ marginTop: 1 }}>
          <Checkbox checked={done} onChange={onToggle} label={action.title} />
        </span>
      }
    >
      <span
        className="t-body"
        style={{
          color: done ? 'var(--tds-fg-tertiary)' : undefined,
          textDecoration: done ? 'line-through' : undefined,
        }}
      >
        {action.title}
      </span>
      <span className="t-small tnum" style={{ color: 'var(--tds-fg-quaternary)' }}>
        {meta}
      </span>
    </Row>
  );
}
