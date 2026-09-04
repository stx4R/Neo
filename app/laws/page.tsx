'use client';

import { useMemo, useState } from 'react';
import { Badge, FilterChip } from '@/components/Badge';
import { Label } from '@/components/Label';
import { Mark } from '@/components/Mark';
import { RiskText } from '@/components/RiskText';
import { Row, RowMeta, RowTitle } from '@/components/Row';
import { Screen } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { TopBar } from '@/components/TopBar';
import { actionsOfLaw, company, productsOfLaw } from '@/lib/data';
import { REFERENCE_DATE, formatSyncTime } from '@/lib/dday';
import {
  FILTER_PRESETS,
  SORT_OPTIONS,
  listBadge,
  markColor,
  statusLine,
  visibleLaws,
  type FilterPreset,
  type SortKey,
} from '@/lib/derive';

// S2 Laws.
// 필터·정렬·검색은 전부 useState. localStorage로 옮기는 건 6단계다.
export default function LawsPage() {
  const [preset, setPreset] = useState<FilterPreset>('내 우선순위');
  const [sort, setSort] = useState<SortKey>('date');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => visibleLaws(preset, sort, query), [preset, sort, query]);
  const activeCountry = company.countries.find((c) => c.active);

  return (
    <Screen scrollPadBottom={180} footer={<TabBar />}>
      <TopBar
        left={<Label color="var(--text)">NEO</Label>}
        right={
          <span className="t-meta tnum" style={{ color: 'var(--text-3)' }}>
            {formatSyncTime(REFERENCE_DATE)}
          </span>
        }
      />

      <div style={{ padding: '12px var(--pad) 0' }}>
        <h1 className="t-h1" style={{ margin: 0, color: 'var(--text)' }}>
          법률.
        </h1>
        <p className="t-meta tnum" style={{ margin: '10px 0 0', color: 'var(--text-3)' }}>
          {activeCountry ? `${activeCountry.code} ${activeCountry.name} · ` : ''}
          {rows.length}건
        </p>
      </div>

      {/* 검색 — 박스가 아니다. 하단 1px 선만 남긴다. */}
      <div style={{ marginTop: 20, padding: '0 var(--pad)' }}>
        <div
          style={{
            height: 44,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid var(--hairline)',
          }}
        >
          <input
            className="t-body"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="법령명, 제품, 키워드"
            aria-label="법률 검색"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--text)',
              padding: 0,
            }}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          display: 'flex',
          gap: 6,
          padding: '0 var(--pad)',
          overflowX: 'auto',
        }}
      >
        {FILTER_PRESETS.map((p) => (
          <FilterChip key={p} active={preset === p} onClick={() => setPreset(p)}>
            {p}
          </FilterChip>
        ))}
      </div>

      {/* 정렬 — 세그먼트 컨트롤이 아니라 텍스트 둘. */}
      <div
        style={{
          marginTop: 20,
          padding: '0 var(--pad)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
        }}
      >
        {SORT_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className="t-meta"
            onClick={() => setSort(key)}
            aria-pressed={sort === key}
            style={{
              padding: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: sort === key ? 'var(--text)' : 'var(--text-3)',
              textDecoration: sort === key ? 'underline' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'var(--sec-gap)', padding: '0 var(--pad)' }}>
        {rows.map((law, i) => {
          const badge = listBadge(law);
          return (
            <Row
              key={law.id}
              height="law"
              href={`/laws/${law.id}`}
              leading={<Mark status={law.status} color={markColor(law)} />}
              leadingAlign="top"
              dimmed={law.status === 'hold'}
              trailing={
                badge ? (
                  <Badge tone={badge.tone} tnum={badge.tnum}>
                    {badge.text}
                  </Badge>
                ) : undefined
              }
              last={i === rows.length - 1}
            >
              <Label>{law.officialRef}</Label>
              <RowTitle>{law.title}</RowTitle>
              <RowMeta>
                {statusLine(law)} · 제품 {productsOfLaw(law).length} · 액션{' '}
                {actionsOfLaw(law).length} · <RiskText level={law.riskLevel} />
              </RowMeta>
            </Row>
          );
        })}
      </div>
    </Screen>
  );
}
