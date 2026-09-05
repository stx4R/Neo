'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ComboPending } from '@/components/ComboEmpty';
import { EmptyState } from '@/components/EmptyState';
import { Label } from '@/components/Label';
import { Row, RowTitle } from '@/components/Row';
import { Screen, Section } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { TopBar } from '@/components/TopBar';
import { countryByCode } from '@/lib/data';
import { useDataset, type Dataset } from '@/lib/dataset';
import { priorityStat, uniqueHsCodes } from '@/lib/derive';
import { updateProducts } from '@/lib/useProfile';
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
  const ds = useDataset();

  const remaining = ALL_CATEGORIES.filter(
    (c) => !priorities.some((p) => p.category === c),
  );

  const origin = ds ? countryByCode(ds.profile.originCountry) : undefined;
  const dest = ds?.country;

  return (
    <Screen scrollPadBottom="var(--pad-tabbar)" footer={<TabBar />}>
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
        {/* 회사명은 선택 입력이다. 없으면 자리표시자를 넣지 않고 품목명이 제목이 된다 —
            품목은 사용자가 실제로 고른 값이라 지어낸 말이 아니다. */}
        <h1 className="t-h1" style={{ margin: 0, color: 'var(--text)' }}>
          {ds?.profile.companyName ?? ds?.category?.nameKo ?? ''}
        </h1>
        {ds?.profile.companyName && ds.category && (
          <p className="t-meta" style={{ margin: '10px 0 0', color: 'var(--text-2)' }}>
            {ds.category.nameKo}
          </p>
        )}
      </div>

      {/* S9 PROFILE ROW — 국가·품목 변경 진입점. */}
      {ds && (
        <div style={{ marginTop: 20, padding: '0 var(--pad)' }}>
          <div
            style={{
              height: 44,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--row-gap)',
              borderTop: '1px solid var(--hairline)',
              borderBottom: '1px solid var(--hairline)',
            }}
          >
            <span className="t-body" style={{ flex: 1, minWidth: 0, color: 'var(--text)' }}>
              {origin?.code ?? ds.profile.originCountry} &rarr;{' '}
              {dest?.code ?? ds.profile.destinationCountry}
              {ds.category ? ` · ${ds.category.nameKo}` : ''}
            </span>
            <Link href="/setup?edit=1" className="t-meta" style={{ flex: 'none' }}>
              변경
            </Link>
          </div>
        </div>
      )}

      {/* 정보 테이블. 카드가 아니라 조판된 2열 블록이다. */}
      {ds && (
        <div style={{ marginTop: 20, padding: '0 var(--pad)' }}>
          <InfoRow label="EXPORT">
            {origin ? `${origin.code} ${origin.nameKo}` : ds.profile.originCountry} &rarr;{' '}
            {dest ? `${dest.code} ${dest.nameKo}` : ds.profile.destinationCountry}
          </InfoRow>
          <InfoRow label="HS CODE">{uniqueHsCodes(ds).join(' · ')}</InfoRow>
          <InfoRow label="PRODUCTS">{ds.products.length}</InfoRow>
          <InfoRow label="LAWS" last>
            {ds.laws.length}
          </InfoRow>
        </div>
      )}

      <Section label={`PRIORITIES — ${priorities.length}`}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {priorities.map((p) => (
            <PriorityTile key={p.id} priority={p} ds={ds} done={done} />
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

      <Section label={`PRODUCTS — ${ds?.products.length ?? 0}`}>
        {!ds && <ComboPending />}
        {/* S9 PRODUCT ROW — 우측 ×로 지우고, 추가는 S8 입력 화면으로 보낸다.
            제품 편집기를 두 벌 만들지 않는다. */}
        {ds?.products.map((product, i) => (
          <Row
            key={product.id}
            height="short"
            last={i === ds.products.length - 1}
            trailing={
              <>
                <span className="t-meta tnum" style={{ flex: 'none', color: 'var(--text-3)' }}>
                  HS {product.hsCode}
                </span>
                <button
                  type="button"
                  aria-label={`${product.name} 지우기`}
                  onClick={() =>
                    updateProducts(ds.products.filter((p) => p.id !== product.id))
                  }
                  className="t-meta"
                  style={{
                    flex: 'none',
                    width: 'var(--mark-w)',
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'right',
                    color: 'var(--text-3)',
                    cursor: 'pointer',
                  }}
                >
                  &times;
                </button>
              </>
            }
          >
            <RowTitle as="span">{product.name}</RowTitle>
          </Row>
        ))}
        {ds && ds.products.length === 0 && (
          <EmptyState size="meta" message="등록한 제품이 없습니다" />
        )}
        {ds && (
          <div style={{ marginTop: 14 }}>
            <Link href="/setup?edit=1&step=4" className="t-body">
              + 제품 추가
            </Link>
          </div>
        )}
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
  ds,
  done,
}: {
  priority: Priority;
  ds: Dataset | null;
  done: ReadonlySet<string>;
}) {
  // 타일 수치는 지금 조합의 법령에서 다시 계산한다.
  const stat = ds
    ? priorityStat(ds, priority.category, done)
    : { lawCount: 0, openCount: 0, risk: null };
  const { lawCount, openCount, risk } = stat;

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
        {ds && (
          <span className="t-meta tnum" style={{ color: 'var(--text-3)' }}>
            법률 {lawCount} · 미완 {openCount}
          </span>
        )}
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
