'use client';

import { useEffect, useRef, useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { Label } from '@/components/Label';
import { Row, RowTitle } from '@/components/Row';
import { Screen, Section } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { TopBar } from '@/components/TopBar';
import { company, laws, products } from '@/lib/data';
import { lawCountForProduct, priorityStat, uniqueHsCodes } from '@/lib/derive';
import { useActionsDone } from '@/lib/useActionsDone';
import { addPriority, usePriorities } from '@/lib/usePriorities';
import {
  CATEGORY_LABEL,
  RISK_COLOR,
  RISK_LABEL,
  type Category,
  type Priority,
} from '@/types/neo';

const ALL_CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[];

export default function CompanyPage() {
  const done = useActionsDone();
  const priorities = usePriorities();

  const active = company.countries.filter((c) => c.active);
  const planned = company.countries.length - active.length;
  const remaining = ALL_CATEGORIES.filter(
    (c) => !priorities.some((p) => p.category === c),
  );

  return (
    <Screen scrollPadBottom={180} footer={<TabBar />}>
      <TopBar
        left={<Label color="var(--text)">NEO</Label>}
        right={
          // 동작 미정. 자리만 잡는다.
          <span className="t-meta" style={{ color: 'var(--text-3)' }}>
            설정
          </span>
        }
      />

      <div style={{ padding: '12px var(--pad) 0' }}>
        <h1 className="t-h1" style={{ margin: 0, color: 'var(--text)' }}>
          {company.name}.
        </h1>
        <p className="t-meta" style={{ margin: '10px 0 0', color: 'var(--text-2)' }}>
          {company.industry}
        </p>
      </div>

      {/* 정보 테이블. 카드가 아니라 조판된 2열 블록이다. */}
      <div style={{ marginTop: 20, padding: '0 var(--pad)' }}>
        <InfoRow label="EXPORT">
          {active.map((c) => `${c.code} ${c.name}`).join(' · ')}{' '}
          {planned > 0 && (
            <span style={{ color: 'var(--text-3)' }}>(+{planned}개국 예정)</span>
          )}
        </InfoRow>
        <InfoRow label="HS CODE">{uniqueHsCodes().join(' · ')}</InfoRow>
        <InfoRow label="PRODUCTS">{products.length}</InfoRow>
        <InfoRow label="LAWS" last>
          {laws.length}
        </InfoRow>
      </div>

      <Section label={`PRIORITIES — ${priorities.length}`}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {priorities.map((p) => (
            <PriorityTile key={p.id} priority={p} done={done} />
          ))}
          {remaining.length > 0 && <AddTile remaining={remaining} />}
        </div>
        {/* 우선순위 제거 기능이 없으므로 기본값 3건에서 0으로 내려갈 길은
            neo.priorities에 빈 배열이 저장된 경우뿐이다. 그래도 타일 격자만 남고
            아무 말이 없는 화면이 되면 무엇을 해야 하는지 알 수 없다. */}
        {priorities.length === 0 && (
          <div style={{ marginTop: 'var(--lbl-gap)' }}>
            <EmptyState
              size="meta"
              message="관심 규제 영역을 추가하면 맞춤 분석이 시작됩니다"
            />
          </div>
        )}
      </Section>

      <Section label={`PRODUCTS — ${products.length}`}>
        {products.map((product, i) => (
          <Row
            key={product.id}
            height="short"
            last={i === products.length - 1}
            trailing={
              <>
                <span className="t-meta tnum" style={{ flex: 'none', color: 'var(--text-3)' }}>
                  {product.hsCode}
                </span>
                <span
                  className="t-meta tnum"
                  style={{
                    flex: 'none',
                    width: 52,
                    textAlign: 'right',
                    color: 'var(--text-3)',
                  }}
                >
                  법률 {lawCountForProduct(product.id)}
                </span>
              </>
            }
          >
            <RowTitle as="span">{product.name}</RowTitle>
          </Row>
        ))}
      </Section>

      <div style={{ marginTop: 'var(--sec-gap)', padding: '0 var(--pad)' }}>
        {/* 동작 미정. 버튼이 아니라 텍스트 링크다. */}
        <span
          className="t-body"
          style={{ color: 'var(--accent)', textDecoration: 'underline', cursor: 'pointer' }}
        >
          맞춤 분석 다시 실행
        </span>
      </div>
    </Screen>
  );
}

function InfoRow({
  label,
  children,
  last = false,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      style={{
        height: 44,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--row-gap)',
        borderTop: '1px solid var(--hairline)',
        borderBottom: last ? '1px solid var(--hairline)' : undefined,
      }}
    >
      <span className="t-label" style={{ flex: 'none', width: 96, color: 'var(--text-3)' }}>
        {label}
      </span>
      <span className="t-body tnum" style={{ flex: 1, color: 'var(--text)' }}>
        {children}
      </span>
    </div>
  );
}

function PriorityTile({
  priority,
  done,
}: {
  priority: Priority;
  done: ReadonlySet<string>;
}) {
  const { lawCount, openCount, risk } = priorityStat(priority.category, done);

  return (
    <div
      style={{
        height: 108,
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 상단 4px 바. 해당 법률이 없으면 신호가 없으므로 헤어라인으로 힘을 뺀다. */}
      <div style={{ height: 4, background: risk ? RISK_COLOR[risk] : 'var(--hairline)' }} />
      <div
        style={{
          flex: 1,
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--stack)',
        }}
      >
        <h2 className="t-h2" style={{ margin: 0, color: 'var(--text)' }}>
          {priority.name}
        </h2>
        <span className="t-meta tnum" style={{ color: 'var(--text-3)' }}>
          법률 {lawCount} · 미완 {openCount}
        </span>
        {risk && (
          <span className="t-label" style={{ marginTop: 'auto', color: RISK_COLOR[risk] }}>
            {RISK_LABEL[risk]}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * `+ 영역 추가` 타일. 누르면 그 자리에서 남은 카테고리 목록으로 바뀐다.
 * 새 화면이나 모달을 열지 않는다. 바깥을 누르면 취소된다.
 * 제거는 없다 — 디자인에 없는 한 방향 동작이다.
 */
function AddTile({ remaining }: { remaining: Category[] }) {
  const [picking, setPicking] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!picking) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setPicking(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [picking]);

  return (
    <div
      ref={ref}
      style={{
        height: 108,
        border: '1px solid var(--hairline)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        gap: 'var(--stack)',
        padding: 14,
      }}
    >
      {picking ? (
        remaining.map((category) => (
          <button
            key={category}
            type="button"
            className="t-body"
            onClick={() => {
              addPriority(category);
              setPicking(false);
            }}
            style={{
              padding: 0,
              border: 'none',
              background: 'transparent',
              color: 'var(--text)',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            {CATEGORY_LABEL[category]}
          </button>
        ))
      ) : (
        <button
          type="button"
          className="t-body"
          onClick={() => setPicking(true)}
          style={{
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-3)',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          + 영역 추가
        </button>
      )}
    </div>
  );
}
