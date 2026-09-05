'use client';

import { Badge } from '@/components/Badge';
import { DotGeo } from '@/components/DotGeo';
import { INSTALL_BANNER_H, InstallBanner } from '@/components/InstallBanner';
import { Label } from '@/components/Label';
import { Mark, Ordinal } from '@/components/Mark';
import { RiskText } from '@/components/RiskText';
import { Row, RowMeta, RowTitle } from '@/components/Row';
import { Screen, Section } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { TopBar, UnreadDot } from '@/components/TopBar';
import { company, notifications, productsOfLaw } from '@/lib/data';
import { REFERENCE_DATE, formatDate, formatMonthDay, formatSyncTime } from '@/lib/dday';
import { heldLaws, markColor, mustDoNow, thisWeek } from '@/lib/derive';
import { useActionsDone } from '@/lib/useActionsDone';
import { useInstallPrompt } from '@/lib/useInstallPrompt';
import { useNotificationsRead } from '@/lib/useNotificationsRead';
import { RISK_COLOR } from '@/types/neo';

// S1 Home.
export default function Home() {
  // S3 체크박스와 같은 스토어를 본다. 여기서 따로 읽으면 두 화면이 어긋난다.
  const done = useActionsDone();
  const must = mustDoNow(done);
  const week = thisWeek();
  const held = heldLaws();
  const read = useNotificationsRead();
  const unread = notifications.filter((n) => !read.has(n.id)).length;
  // 설치 배너는 계획서대로 / 에만 둔다. 2회차 방문부터 뜬다.
  const installPrompt = useInstallPrompt();

  const activeCountry = company.countries.find((c) => c.active);
  const sector = company.industry.split(' · ')[0];

  return (
    <Screen
      // 배너가 뜨면 마지막 행이 그 뒤로 들어가지 않게 여백을 같이 민다.
      scrollPadBottom={installPrompt ? 130 + INSTALL_BANNER_H : 130}
      footer={
        <>
          {installPrompt && <InstallBanner />}
          <TabBar />
        </>
      }
    >
      <TopBar
        left={<Label color="var(--text)">NEO</Label>}
        right={
          <>
            <span className="t-meta tnum" style={{ color: 'var(--text-3)' }}>
              {formatSyncTime(REFERENCE_DATE)}
            </span>
            {unread > 0 && <UnreadDot count={unread} href="/notifications" />}
          </>
        }
      />

      <div style={{ padding: '12px var(--pad) 0' }}>
        <div
          style={{
            height: 'var(--block-h)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 var(--block-pad)',
            background: RISK_COLOR.critical,
          }}
        >
          <h1 className="t-h1" style={{ margin: 0, color: 'var(--on-color)' }}>
            대응 필요 <span className="tnum">{must.length}</span>건.
          </h1>
        </div>
        <p className="t-meta" style={{ margin: '10px 0 0', color: 'var(--text-2)' }}>
          {company.name}
          {activeCountry ? ` · ${activeCountry.code} ${activeCountry.name}` : ''} · {sector}
        </p>
      </div>

      {/* 지구본. 296×240을 우측 정렬하고 margin-right -36으로 우측을 화면 밖으로
          흘린다. 좌측에 여백이 남는 비대칭이 의도다 — 가운데 정렬하지 말 것. */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
        <DotGeo mode="globe" style={{ width: 296, height: 240, marginRight: -36 }} />
      </div>

      {held.length > 0 && (
        <div style={{ marginTop: 4, padding: '0 var(--pad)' }}>
          {held.map((law, i) => (
            <Row
              key={law.id}
              height="short"
              leading={<Mark status="hold" fixedWidth={false} />}
              trailing={
                <span
                  className="t-meta tnum"
                  style={{ flex: 'none', color: 'var(--text-3)' }}
                >
                  {law.heldAt ? formatMonthDay(law.heldAt) : ''}
                </span>
              }
              last={i === held.length - 1}
            >
              <RowTitle as="span">{law.officialRef} 시행 보류</RowTitle>
            </Row>
          ))}
        </div>
      )}

      <Section label="MUST DO NOW">
        {must.map(({ law, action, countdown }, i) => (
          <Row
            key={action.id}
            height="action"
            leading={<Ordinal n={i + 1} />}
            leadingAlign="top"
            trailing={
              <Badge tone={countdown.tone} tnum={!countdown.overdue}>
                {countdown.text}
              </Badge>
            }
            last={i === must.length - 1}
          >
            <span className="t-body" style={{ color: 'var(--text)' }}>
              {action.title}
            </span>
            <Label>{law.officialRef}</Label>
          </Row>
        ))}
      </Section>

      <Section label="THIS WEEK">
        {week.map((law, i) => (
          <Row
            key={law.id}
            height="info"
            leading={<Mark status={law.status} color={markColor(law)} />}
            last={i === week.length - 1}
          >
            <RowTitle>{law.title}</RowTitle>
            <RowMeta>
              {formatDate(law.effectiveDate)} · 제품 {productsOfLaw(law).length} ·{' '}
              <RiskText level={law.riskLevel} />
            </RowMeta>
          </Row>
        ))}
      </Section>
    </Screen>
  );
}

