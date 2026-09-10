'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/Card';
import { ComboPending } from '@/components/ComboEmpty';
import { EmptyState } from '@/components/EmptyState';
import { CATEGORY_ICON, Icon } from '@/components/Icon';
import { IconTile } from '@/components/IconTile';
import { InfoRow, Row } from '@/components/Row';
import { Screen, Section } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { TopBar } from '@/components/TopBar';
import { countryByCode } from '@/lib/data';
import { useDataset, type Dataset } from '@/lib/dataset';
import { priorityStat, uniqueHsCodes } from '@/lib/derive';
import { updateProducts } from '@/lib/useProfile';
import { useActionsDone } from '@/lib/useActionsDone';
import { addPriority, usePriorities } from '@/lib/usePriorities';
import { CATEGORY_LABEL, RISK_LABEL, type Category, type Priority } from '@/types/neo';

const ALL_CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[];

// S4 Company. 탭 이름은 '회사'다.
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
    <Screen bg="canvas" scrollPadBottom="var(--pad-tabbar)" footer={<TabBar />}>
      {/* 우상단 '편집'은 회사명·제품 입력(셋업 4단계)으로 간다. 예전에 지운 '설정'과
          달리 열 화면이 있는 컨트롤이다(4차 B7-3). */}
      <TopBar
        left={<span className="t-appbar">회사</span>}
        right={
          ds && (
            <Link href="/setup?edit=1&step=4" className="t-body-b tap" style={{ lineHeight: 1 }}>
              편집
            </Link>
          )
        }
      />

      <div style={{ padding: '8px var(--pad) 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* 회사명은 선택 입력이다. 없으면 자리표시자를 넣지 않고 품목명이 제목이 된다 —
              품목은 사용자가 실제로 고른 값이라 지어낸 말이 아니다. */}
          <h1 className="t-h1">{ds?.profile.companyName ?? ds?.category?.nameKo ?? ''}</h1>
          {ds?.profile.companyName && ds.category && (
            <p className="t-meta" style={{ color: 'var(--tds-fg-tertiary)' }}>
              {ds.category.nameKo}
            </p>
          )}
        </div>

        {/* 수출 경로 + 정보. 첫 줄의 '변경'이 국가·품목 변경 진입점이다. */}
        {ds && (
          <Card>
            <div
              style={{
                height: 56,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                borderBottom: '1px solid var(--tds-line-default)',
              }}
            >
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  font: '600 17px/1.4 var(--font)',
                  letterSpacing: '-0.01em',
                }}
              >
                {origin?.code ?? ds.profile.originCountry}
                <Icon name="arrow-right" size={16} stroke={2} style={{ color: 'var(--tds-fg-quaternary)' }} />
                <span className="one-line">
                  {dest ? `${dest.code} ${dest.nameKo}` : ds.profile.destinationCountry}
                </span>
              </span>
              <Link href="/setup?edit=1" className="t-label tap" style={{ flex: 'none', lineHeight: 1 }}>
                변경
              </Link>
            </div>
            <InfoRow label="HS 코드">
              <span className="one-line" style={{ display: 'block' }}>
                {uniqueHsCodes(ds).join(' · ')}
              </span>
            </InfoRow>
            <InfoRow label="제품">{ds.products.length}</InfoRow>
            <InfoRow label="규제" divider={false}>
              {ds.laws.length}
            </InfoRow>
          </Card>
        )}

        <Section title="관심 규제 영역">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {priorities.map((p) => (
              <PriorityTile key={p.id} priority={p} ds={ds} done={done} />
            ))}
            {remaining.length > 0 && <AddTile remaining={remaining} />}
          </div>
          {/* 우선순위 제거 기능이 없으므로 기본값 3건에서 0으로 내려갈 길은
              neo.priorities에 빈 배열이 저장된 경우뿐이다. 그래도 타일만 남고
              아무 말이 없는 화면이 되면 무엇을 해야 하는지 알 수 없다. */}
          {priorities.length === 0 && (
            <EmptyState size="meta" message="관심 규제 영역을 추가하면 맞춤 분석을 시작해요" />
          )}
        </Section>

        <Section
          title={
            <>
              제품{' '}
              <span className="tnum" style={{ color: 'var(--tds-fg-quaternary)' }}>
                {ds?.products.length ?? 0}
              </span>
            </>
          }
        >
          {!ds && <ComboPending />}
          {/* 제품 행 — 오른쪽 ×로 지우고, 추가는 셋업 4단계 입력 화면으로 보낸다.
              제품 편집기를 두 벌 만들지 않는다. */}
          {ds && (
            <Card>
              {ds.products.map((product) => (
                <Row
                  key={product.id}
                  trailing={
                    <>
                      <span className="t-meta tnum" style={{ flex: 'none', color: 'var(--tds-fg-tertiary)' }}>
                        HS {product.hsCode}
                      </span>
                      <button
                        type="button"
                        aria-label={`${product.name} 지우기`}
                        onClick={() =>
                          updateProducts(ds.products.filter((p) => p.id !== product.id))
                        }
                        className="tap"
                        style={{
                          flex: 'none',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--tds-fg-quaternary)',
                          cursor: 'pointer',
                        }}
                      >
                        <Icon name="x" size={18} />
                      </button>
                    </>
                  }
                >
                  <span className="t-body one-line">{product.name}</span>
                </Row>
              ))}
              {ds.products.length === 0 && (
                <Row>
                  <span className="t-meta" style={{ color: 'var(--tds-fg-tertiary)' }}>
                    등록한 제품이 없어요
                  </span>
                </Row>
              )}
              <Link
                href="/setup?edit=1&step=4"
                style={{ height: 52, display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <Icon name="plus" size={18} stroke={2} />
                <span className="t-body-b" style={{ lineHeight: 1 }}>
                  제품 추가
                </span>
              </Link>
            </Card>
          )}
        </Section>

        {/* '맞춤 분석 다시 실행'은 두지 않는다. 재실행할 분석이 없다 — 화면은 프로필이
            바뀌면 이미 즉시 따라간다. 없는 계산을 있는 것처럼 보이게 한다(4차 B7-3). */}
      </div>
    </Screen>
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
  const { lawCount, openCount, risk } = ds
    ? priorityStat(ds, priority.category, done)
    : { lawCount: 0, openCount: 0, risk: null };

  return (
    <Card padding={14} radius="var(--r-xl)" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* 아이콘 색이 그 영역 법률의 최대 위험도다. 해당 법률이 없으면 신호가 없으므로
          중립색으로 힘을 뺀다. */}
      <IconTile
        tone={risk ?? 'neutral'}
        size={36}
        radius="var(--r-m)"
        label={risk ? `위험도 ${RISK_LABEL[risk]}` : undefined}
      >
        <Icon name={CATEGORY_ICON[priority.category]} size={20} />
      </IconTile>
      <span className="t-body-b">{priority.name}</span>
      {ds && (
        <span className="t-small tnum" style={{ color: 'var(--tds-fg-tertiary)' }}>
          법률 {lawCount} · 미완 {openCount}
        </span>
      )}
    </Card>
  );
}

/**
 * `+ 영역 추가` 타일. 누르면 그 자리에서 남은 영역 목록으로 바뀐다.
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
        // 이웃 타일(36 + 8 + 21 + 8 + 17 + 위아래 14)과 같은 높이. 한 줄에 혼자 남아도 줄지 않는다.
        minHeight: 118,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 2,
        padding: picking ? 6 : 0,
        borderRadius: 'var(--r-xl)',
        border: '1px dashed var(--tds-line-strong)',
      }}
    >
      {picking ? (
        remaining.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              addPriority(category);
              setPicking(false);
            }}
            className="t-body-b"
            style={{
              height: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 8px',
              borderRadius: 'var(--r-m)',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <Icon
              name={CATEGORY_ICON[category]}
              size={18}
              style={{ color: 'var(--tds-fg-tertiary)' }}
            />
            {CATEGORY_LABEL[category]}
          </button>
        ))
      ) : (
        <button
          type="button"
          onClick={() => setPicking(true)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            color: 'var(--tds-fg-tertiary)',
            cursor: 'pointer',
          }}
        >
          <Icon name="plus" size={20} />
          <span className="t-label">영역 추가</span>
        </button>
      )}
    </div>
  );
}
