'use client';

import { useMemo, useState } from 'react';
import { Chip } from '@/components/Badge';
import { ComboEmpty, ComboPending } from '@/components/ComboEmpty';
import { EmptyState } from '@/components/EmptyState';
import { SearchField } from '@/components/Field';
import { LawRow } from '@/components/LawRow';
import { Screen } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { TopBar } from '@/components/TopBar';
import { useDataset } from '@/lib/dataset';
import {
  FILTER_PRESETS,
  SORT_OPTIONS,
  lawBadge,
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

// S2 Laws. 탭 이름은 '규제'다.
// 필터·정렬·검색은 전부 useState — 화면을 떠나면 처음으로 돌아간다.
export default function LawsPage() {
  const [preset, setPreset] = useState<FilterPreset>('내 우선순위');
  const [sort, setSort] = useState<SortKey>('date');
  const [query, setQuery] = useState('');
  const done = useActionsDone();
  const priorities = usePriorities();
  const saved = useLawsSaved();

  const ds = useDataset();
  const rows = useMemo(
    () => (ds ? visibleLaws(ds, preset, sort, query, priorities, saved) : []),
    [ds, preset, sort, query, priorities, saved],
  );

  return (
    <Screen scrollPadBottom="var(--pad-tabbar)" footer={<TabBar />}>
      {/* 디자인 원본의 우상단 필터 아이콘은 뺐다. 필터는 바로 아래 칩이 전부 한다 —
          열 화면이 없는 컨트롤을 두지 않는다(4차 B7-3과 같은 판단). */}
      <TopBar left={<span className="t-appbar">규제</span>} />

      <div style={{ padding: '4px var(--pad) 0' }}>
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="법령명, 제품, 키워드"
          ariaLabel="규제 검색"
        />
      </div>

      {/* 칩 줄은 가로로 스크롤된다. 좌우 패딩을 스크롤 안쪽에 둬서 칩이 화면 끝까지 흐른다. */}
      <div
        style={{
          marginTop: 14,
          display: 'flex',
          gap: 6,
          padding: '0 var(--pad)',
          overflowX: 'auto',
        }}
      >
        {FILTER_PRESETS.map((p) => (
          <Chip key={p} active={preset === p} onClick={() => setPreset(p)}>
            {p}
          </Chip>
        ))}
      </div>

      {/* 국가 필터 칩은 없다 — 도착국은 프로필로 고정이라 거를 것이 없다.
          대신 지금 조합과 건수를 여기 적는다. */}
      <div
        style={{
          marginTop: 14,
          padding: '0 var(--pad)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span className="t-meta tnum one-line" style={{ color: 'var(--tds-fg-tertiary)' }}>
          {ds && (
            <>
              {ds.country ? `${ds.country.code} ${ds.country.nameKo} · ` : ''}
              {ds.category ? `${ds.category.nameKo} · ` : ''}
              {rows.length}건
            </>
          )}
        </span>
        <Segmented options={SORT_OPTIONS} value={sort} onChange={setSort} />
      </div>

      <div style={{ padding: '14px var(--pad) 0' }}>
        {!ds && <ComboPending />}
        {ds?.empty && (
          <ComboEmpty
            combo={`${ds.country?.code ?? ds.profile.destinationCountry} ${ds.country?.nameKo ?? ''} · ${ds.category?.nameKo ?? ds.profile.itemCategory}`}
          />
        )}
        {ds && !ds.empty && rows.length === 0 && (
          <div style={{ paddingTop: 12 }}>
            <EmptyState
              // '저장됨'만 문구를 따로 준다. 나머지는 조건을 좁혀서 0건이지만
              // 이건 사용자가 아직 아무것도 저장하지 않은 것이라 원인이 다르다.
              message={
                preset === '저장됨'
                  ? '저장한 법률이 없어요. 법률 상세 오른쪽 위 북마크로 저장해요'
                  : '조건에 맞는 법률이 없어요'
              }
              actionLabel="필터 초기화"
              // 정렬은 건드리지 않는다 — 결과를 0건으로 만드는 건 필터와 검색뿐이다.
              onAction={() => {
                setPreset('전체');
                setQuery('');
              }}
            />
          </div>
        )}
        {ds &&
          rows.map((law) => (
            <LawRow
              key={law.id}
              law={law}
              href={`/laws/${law.id}`}
              badge={lawBadge(law, ds.today)}
              meta={`${statusLine(law)} · 제품 ${productsOfLaw(ds, law).length} · 미완 ${openActionsOfLaw(ds, law, done).length}`}
            />
          ))}

        {/* 출발국을 바꿨는데 아무것도 안 바뀐 척하지 않는다. 반대로 바뀐 척도 하지 않는다.
            originScope 데이터는 KR 출발분만 채워져 있다. */}
        {ds && ds.hiddenByOrigin > 0 && (
          <p className="t-meta" style={{ marginTop: 20, color: 'var(--tds-fg-tertiary)' }}>
            출발국 KR 외에는 수출국별 요건 데이터가 아직 없어요
          </p>
        )}
      </div>
    </Screen>
  );
}

/**
 * 정렬 세그먼트. 회색 트랙 안에서 고른 칸만 떠오른다(--segment-on + shadow-1).
 * 둘 중 하나를 고르는 상호 배타 선택이라 칩이 아니라 이것이다.
 */
function Segmented<K extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { key: K; label: string }[];
  value: K;
  onChange: (next: K) => void;
}) {
  return (
    <div
      style={{
        flex: 'none',
        display: 'flex',
        padding: 3,
        borderRadius: 'var(--r-m)',
        background: 'var(--tds-bg-secondary)',
      }}
    >
      {options.map(({ key, label }) => {
        const on = key === value;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(key)}
            className="t-label tap-y"
            style={{
              height: 30,
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              borderRadius: 9,
              lineHeight: 1,
              background: on ? 'var(--segment-on)' : 'transparent',
              boxShadow: on ? 'var(--shadow-1)' : undefined,
              color: on ? 'var(--tds-fg-primary)' : 'var(--tds-fg-secondary)',
              cursor: 'pointer',
              transition: 'background-color var(--dur-base) var(--ease), color var(--dur-base) var(--ease)',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
