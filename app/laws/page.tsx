'use client';

import { useMemo, useState } from 'react';
import { Badge, FilterChip } from '@/components/Badge';
import { ComboEmpty, ComboPending } from '@/components/ComboEmpty';
import { EmptyState } from '@/components/EmptyState';
import { Label } from '@/components/Label';
import { Mark } from '@/components/Mark';
import { RiskText } from '@/components/RiskText';
import { Row, RowMeta, RowTitle } from '@/components/Row';
import { Screen } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { TopBar } from '@/components/TopBar';
import { useDataset } from '@/lib/dataset';
import { formatDate } from '@/lib/dday';

import {
  FILTER_PRESETS,
  SORT_OPTIONS,
  dataAsOf,
  listBadge,
  markColor,
  openActionsOfLaw,
  productsOfLaw,
  statusLine,
  visibleLaws,
  type FilterPreset,
  type SortKey,
} from '@/lib/derive';
import { useActionsDone } from '@/lib/useActionsDone';
import { useLawsSaved } from '@/lib/useLawsSaved';
import { usePriorities } from '@/lib/usePriorities';

// S2 Laws.
// 필터·정렬·검색은 전부 useState. localStorage로 옮기는 건 6단계다.
export default function LawsPage() {
  const [preset, setPreset] = useState<FilterPreset>('내 우선순위');
  const [sort, setSort] = useState<SortKey>('date');
  const [query, setQuery] = useState('');
  const done = useActionsDone();
  const priorities = usePriorities();
  const saved = useLawsSaved();

  const ds = useDataset();
  const asOf = ds ? dataAsOf(ds) : null;
  const rows = useMemo(
    () => (ds ? visibleLaws(ds, preset, sort, query, priorities, saved) : []),
    [ds, preset, sort, query, priorities, saved],
  );

  return (
    <Screen scrollPadBottom="var(--pad-tabbar)" footer={<TabBar />}>
      <TopBar
        left={<Label color="var(--text)">NEO</Label>}
        right={
          asOf && (
            <span className="t-meta tnum" style={{ color: 'var(--text-3)' }}>
              {formatDate(asOf)} 확인
            </span>
          )
        }
      />

      <div style={{ padding: '12px var(--pad) 0' }}>
        <h1 className="t-h1" style={{ margin: 0, color: 'var(--text)' }}>
          법률
        </h1>
        {/* 국가 필터 칩은 없앴다 — 도착국은 프로필로 고정이라 거를 것이 없다.
            대신 지금 조합을 여기 적는다. */}
        {ds && (
          <p className="t-meta tnum" style={{ margin: '10px 0 0', color: 'var(--text-3)' }}>
            {ds.country ? `${ds.country.code} ${ds.country.nameKo} · ` : ''}
            {ds.category ? `${ds.category.nameKo} · ` : ''}
            {rows.length}건
          </p>
        )}
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
              // 감싸는 행은 border-box 44px라 안쪽이 43px다. 44를 명시해 타겟을 맞춘다.
              height: 44,
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
            className="t-meta tap-y"
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
        {!ds && <ComboPending />}
        {ds?.empty && (
          <ComboEmpty
            combo={`${ds.country?.code ?? ds.profile.destinationCountry} ${ds.country?.nameKo ?? ''} · ${ds.category?.nameKo ?? ds.profile.itemCategory}`}
          />
        )}
        {ds && !ds.empty && rows.length === 0 && (
          <EmptyState
            // '저장됨'만 문구를 따로 준다. 나머지는 조건을 좁혀서 0건이지만
            // 이건 사용자가 아직 아무것도 저장하지 않은 것이라 원인이 다르다.
            message={
              preset === '저장됨'
                ? '저장한 법률이 없습니다. 법률 상세 우상단에서 저장합니다'
                : '조건에 맞는 법률이 없습니다'
            }
            actionLabel="필터 초기화"
            // 정렬은 건드리지 않는다 — 결과를 0건으로 만드는 건 필터와 검색뿐이다.
            onAction={() => {
              setPreset('전체');
              setQuery('');
            }}
          />
        )}
        {rows.map((law, i) => {
          const badge = listBadge(law, ds!.today);
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
                {statusLine(law)} · 제품 {productsOfLaw(ds!, law).length} · 미완{' '}
                {openActionsOfLaw(ds!, law, done).length} · <RiskText level={law.riskLevel} />
              </RowMeta>
            </Row>
          );
        })}

        {/* 출발국을 바꿨는데 아무것도 안 바뀐 척하지 않는다. 반대로 바뀐 척도 하지 않는다.
            originScope 데이터는 KR 출발분만 채워져 있다. */}
        {ds && ds.hiddenByOrigin > 0 && (
          <p
            className="t-meta"
            style={{ margin: 'var(--sec-gap) 0 0', color: 'var(--text-3)' }}
          >
            출발국 KR 외에는 수출국별 요건 데이터가 아직 없습니다
          </p>
        )}
      </div>
    </Screen>
  );
}
