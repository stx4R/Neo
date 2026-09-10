'use client';

import { useState } from 'react';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { ComboEmpty, ComboPending } from '@/components/ComboEmpty';
import { DotGeo } from '@/components/DotGeo';
import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { IconTile } from '@/components/IconTile';
import { INSTALL_BANNER_H, InstallBanner } from '@/components/InstallBanner';
import { LawRow } from '@/components/LawRow';
import { ProgressBar } from '@/components/ProgressBar';
import { Row } from '@/components/Row';
import { Screen, Section } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BellButton, TopBar } from '@/components/TopBar';
import { countryByCode } from '@/lib/data';
import { useDataset, type Dataset } from '@/lib/dataset';
import { formatMonthDay } from '@/lib/dday';
import {
  actionProgress,
  dataAsOf,
  derivedNotifications,
  heldLaws,
  lawBadge,
  lawOverview,
  mustDoNow,
  productsOfLaw,
  statusLine,
  thisWeek,
} from '@/lib/derive';
import { useActionsDone } from '@/lib/useActionsDone';
import { useInstallPrompt } from '@/lib/useInstallPrompt';
import { useNotificationsRead } from '@/lib/useNotificationsRead';
import { RISK_LABEL, TONE_COLOR } from '@/types/neo';

/** 접힌 할 일 목록에 세우는 행 수. 디자인 원본 실측. */
const PREVIEW = 3;

// S1 Home.
export default function Home() {
  // S3 체크박스와 같은 스토어를 본다. 여기서 따로 읽으면 두 화면이 어긋난다.
  const done = useActionsDone();
  const ds = useDataset();
  const must = ds ? mustDoNow(ds, done) : [];
  const progress = ds ? actionProgress(ds, done) : null;
  const week = ds ? thisWeek(ds) : [];
  const held = ds ? heldLaws(ds) : [];
  const read = useNotificationsRead();
  // 벨 숫자도 파생 알림에서 센다. S6와 다른 수를 보이면 안 된다.
  const unread = ds
    ? derivedNotifications(ds, done).filter((n) => !read.has(n.id)).length
    : 0;
  // 설치 카드는 계획서대로 / 에만 둔다. 2회차 방문부터 뜬다.
  const installPrompt = useInstallPrompt();
  // "전체보기"와 "N건 더 보기"는 같은 일을 한다 — 접힌 목록을 제자리에서 편다.
  // 할 일 전체를 따로 보여 줄 화면이 없다. 이 목록이 전부다.
  const [expanded, setExpanded] = useState(false);

  // 항로 좌표. 출발국이 countries.json에 없으면 DotGeo의 기본값이 그려진다.
  const origin = ds ? countryByCode(ds.profile.originCountry) : undefined;
  const dest = ds?.country;
  const asOf = ds ? dataAsOf(ds) : null;
  const shown = expanded ? must : must.slice(0, PREVIEW);
  const folded = must.length - shown.length;

  return (
    <Screen
      bg="canvas"
      // 설치 카드가 뜨면 마지막 카드가 그 뒤로 들어가지 않게 여백을 같이 민다.
      scrollPadBottom={
        installPrompt ? `calc(var(--pad-tabbar) + ${INSTALL_BANNER_H}px)` : 'var(--pad-tabbar)'
      }
      footer={
        <>
          {installPrompt && <InstallBanner />}
          <TabBar />
        </>
      }
    >
      <TopBar
        left={<span className="t-appbar">NEO</span>}
        right={
          <>
            {asOf && (
              <span className="t-caption tnum" style={{ color: 'var(--tds-fg-quaternary)' }}>
                {formatMonthDay(asOf)} 확인
              </span>
            )}
            {/* 테마 버튼과 벨은 한 묶음이다. 40px 버튼 둘을 4px로 붙인다 —
                44px 히트 영역끼리 겹치지 않는 가장 좁은 간격이다. */}
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ThemeToggle />
              <BellButton count={unread} href="/notifications" />
            </span>
          </>
        }
      />

      <div style={{ padding: '8px var(--pad) 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h1 className="t-h1">{ds && headline(ds, must.length, progress)}</h1>
          {/* 프로필 줄. 회사명은 선택 입력이라 없으면 그 칸을 아예 적지 않는다.
              "회사명 없음" 같은 자리표시자를 넣지 않는다. */}
          {ds && (
            <p className="t-meta" style={{ color: 'var(--tds-fg-tertiary)' }}>
              {[
                ds.profile.companyName,
                dest ? `${dest.code} ${dest.nameKo}` : undefined,
                ds.category?.nameKo,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
        </div>

        {ds && (
          <Card padding="18px 20px" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="t-caption" style={{ color: 'var(--tds-fg-quaternary)' }}>
                  수출 경로
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    font: '700 20px/1.35 var(--font)',
                    letterSpacing: '-0.015em',
                  }}
                >
                  {origin?.code ?? ds.profile.originCountry}
                  <Icon
                    name="arrow-right"
                    size={18}
                    stroke={2}
                    style={{ color: 'var(--tds-fg-quaternary)' }}
                  />
                  <span className="one-line">
                    {dest ? `${dest.code} ${dest.nameKo}` : ds.profile.destinationCountry}
                  </span>
                </span>
              </div>
              {/* 지구본. 디자인 원본의 84px 원 자리다. 원 바탕이 지구의 윤곽을 대신한다 —
                  육지 점만 찍히므로 바탕이 없으면 대륙이 허공에 뜬다.
                  문구가 들어갈 자리가 없어 에러 문구는 끈다. */}
              <div
                style={{
                  flex: 'none',
                  width: 84,
                  height: 84,
                  borderRadius: 'var(--r-full)',
                  background: 'var(--tds-bg-secondary)',
                  overflow: 'hidden',
                }}
              >
                <DotGeo
                  mode="globe"
                  dotColor="var(--geo-dot-globe)"
                  from={origin ? [origin.lng, origin.lat] : undefined}
                  to={dest ? [dest.lng, dest.lat] : undefined}
                  showError={false}
                />
              </div>
            </div>

            {progress && progress.total > 0 && (
              <>
                <div style={{ height: 1, background: 'var(--tds-line-default)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <span className="t-body" style={{ color: 'var(--tds-fg-secondary)' }}>
                      액션{' '}
                      <span className="tnum" style={{ fontWeight: 600, color: 'var(--tds-fg-primary)' }}>
                        {progress.done}
                      </span>
                      /<span className="tnum">{progress.total}</span> 완료
                    </span>
                    <span className="t-label tnum" style={{ lineHeight: 1, color: 'var(--tds-fg-brand)' }}>
                      {Math.round((progress.done / progress.total) * 100)}%
                    </span>
                  </div>
                  <ProgressBar value={progress.done / progress.total} label="액션 진행률" />
                </div>
              </>
            )}
          </Card>
        )}

        {/* 보류된 법령. 목록에서 빠지는 대신 여기서 한 번 알린다 —
            갑자기 할 일이 줄어든 이유를 말해 주는 자리다. */}
        {held.map((law) => (
          <div
            key={law.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 14px',
              borderRadius: 'var(--r-l)',
              background: 'var(--risk-med-bg)',
              color: 'var(--risk-med-fg)',
            }}
          >
            <Icon name="triangle-alert" size={20} />
            <span className="t-meta" style={{ flex: 1, minWidth: 0 }}>
              {law.officialRef} 시행이 보류됐어요
            </span>
            {law.heldAt && (
              <span className="t-small tnum" style={{ flex: 'none' }}>
                {formatMonthDay(law.heldAt)}
              </span>
            )}
          </div>
        ))}

        <Section
          title="지금 해야 할 일"
          action={
            folded > 0 && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="t-label tap-y"
                style={{ lineHeight: 1, color: 'var(--tds-fg-brand)', cursor: 'pointer' }}
              >
                전체보기
              </button>
            )
          }
        >
          {!ds && <ComboPending />}
          {ds?.empty && (
            <ComboEmpty
              combo={`${dest?.code ?? ds.profile.destinationCountry} ${dest?.nameKo ?? ''} · ${ds.category?.nameKo ?? ds.profile.itemCategory}`}
            />
          )}
          {ds && !ds.empty && must.length === 0 && <EmptyState message="지금 할 일이 없어요" />}
          {must.length > 0 && (
            <Card>
              {shown.map(({ law, action, countdown }, i) => (
                <Row
                  key={action.id}
                  divider={i < shown.length - 1 || folded > 0}
                  leading={
                    <IconTile tone="brand">
                      <span style={{ font: '700 15px/1 var(--font)', fontVariantNumeric: 'tabular-nums' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </IconTile>
                  }
                  trailing={
                    <Badge tone={countdown.tone} tnum={!countdown.overdue}>
                      {countdown.text}
                    </Badge>
                  }
                >
                  <span className="t-body-m one-line">{action.title}</span>
                  <span className="t-small tnum one-line" style={{ color: 'var(--tds-fg-tertiary)' }}>
                    {[law.officialRef, action.owner, action.effort].join(' · ')}
                  </span>
                </Row>
              ))}
              {folded > 0 && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  style={{
                    width: '100%',
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: 'var(--tds-fg-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <span className="t-body-m tnum" style={{ lineHeight: 1 }}>
                    {folded}건 더 보기
                  </span>
                  <Icon name="chevron-right" size={20} style={{ color: 'var(--tds-fg-quaternary)' }} />
                </button>
              )}
            </Card>
          )}
        </Section>

        {/* 이번 주에 실제로 무슨 일이 있는 법령이 없으면 섹션 자체를 그리지 않는다.
            아무 일도 없는 주에 "이번 주"라는 제목만 남기지 않는다. */}
        {ds && week.length > 0 && (
          <Section title="이번 주">
            <Card>
              {week.map((law, i) => (
                <LawRow
                  key={law.id}
                  law={law}
                  href={`/laws/${law.id}`}
                  badge={lawBadge(law, ds.today)}
                  meta={`${statusLine(law)} · 제품 ${productsOfLaw(ds, law).length}`}
                  divider={i < week.length - 1}
                />
              ))}
            </Card>
          </Section>
        )}

        {ds && !ds.empty && <Overview ds={ds} />}
      </div>
    </Screen>
  );
}

/**
 * 머리말. 남은 할 일 수가 곧 제목이다.
 * 0건일 때 "다 끝냈다"와 "애초에 없다"를 가른다 — 둘은 사용자에게 다른 소식이다.
 */
function headline(
  ds: Dataset,
  left: number,
  progress: { done: number; total: number } | null,
) {
  if (ds.empty) return '규제 데이터가 아직 없어요';
  if (left > 0) {
    return (
      <>
        지금 해야 할 일이
        <br />
        <span className="tnum">{left}</span>건 남았어요
      </>
    );
  }
  return progress && progress.total > 0 ? '해야 할 일을 모두 끝냈어요' : '지금 해야 할 일이 없어요';
}

/** 규제 요약 카드. 시행 중인 법령을 위험도 점으로 세고, 누르면 규제 목록으로 간다. */
function Overview({ ds }: { ds: Dataset }) {
  const o = lawOverview(ds);
  return (
    <Card
      href="/laws"
      padding="18px 20px"
      style={{ display: 'flex', alignItems: 'center', gap: 16 }}
    >
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="t-body-b">
          시행 중인 규제 <span className="tnum">{o.active}</span>건
        </span>
        <span
          className="t-small tnum"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            columnGap: 12,
            rowGap: 4,
            color: 'var(--tds-fg-tertiary)',
          }}
        >
          {o.byRisk.map(({ risk, count }) => (
            <span key={risk} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                role="img"
                aria-label={RISK_LABEL[risk]}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 'var(--r-full)',
                  background: TONE_COLOR[risk].fg,
                }}
              />
              {count}
            </span>
          ))}
          <span>
            보류 {o.hold} · 예정 {o.scheduled}
          </span>
        </span>
      </span>
      <Icon name="chevron-right" size={20} style={{ color: 'var(--tds-fg-quaternary)' }} />
    </Card>
  );
}
