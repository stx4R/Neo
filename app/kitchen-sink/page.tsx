'use client';

// 3단계 검증용. 공용 컴포넌트 9종을 모든 변형으로 늘어놓는다.
// 최종 대조(12단계) 전에 지운다.

import { useState } from 'react';
import { Badge, FilterChip } from '@/components/Badge';
import { Checkbox } from '@/components/Checkbox';
import { ColorBlock } from '@/components/ColorBlock';
import { Label } from '@/components/Label';
import { Mark, Ordinal } from '@/components/Mark';
import { RiskText } from '@/components/RiskText';
import { Row, RowMeta, RowTitle } from '@/components/Row';
import { TabBar } from '@/components/TabBar';
import { TopBar, UnreadDot } from '@/components/TopBar';
import { RISK_COLOR, STATUS_COLOR, type RiskLevel } from '@/types/neo';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 'var(--sec-gap)', padding: '0 var(--pad)' }}>
      <Label>{title}</Label>
      <div style={{ marginTop: 'var(--lbl-gap)' }}>{children}</div>
    </section>
  );
}

const PRODUCTS: [string, string, RiskLevel][] = [
  ['김치양념 소스', '2103.90', 'high'],
  ['조미김', '2008.99', 'high'],
  ['고추장', '2103.90', 'medium'],
  ['유자청', '2007.99', 'low'],
];

const TASKS = [
  '라벨 시안에 원산지 영문표기 반영',
  '최소 글꼴 0.9mm 이상 확인',
  '영양성분표 삽입 (Circular 29 연계)',
  '구포장 재고 소진 계획 수립',
];

export default function KitchenSink() {
  const [checked, setChecked] = useState([false, true, false, false]);
  const [filter, setFilter] = useState('내 우선순위');

  const tick = (i: number) => (v: boolean) =>
    setChecked((prev) => prev.map((c, j) => (j === i ? v : c)));

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 130 }}>
      <TopBar
        left={<Label color="var(--text)">NEO</Label>}
        right={
          <>
            <span className="t-meta tnum" style={{ color: 'var(--text-3)' }}>
              09.03 08:12
            </span>
            <UnreadDot count={3} />
          </>
        }
      />

      <div style={{ padding: '12px var(--pad) 0' }}>
        <ColorBlock tone={RISK_COLOR.critical}>대응 필요 3건.</ColorBlock>
      </div>

      <Section title="COLORBLOCK — 색면 4종">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ColorBlock tone="var(--accent)">시안 색면.</ColorBlock>
          <ColorBlock tone={RISK_COLOR.high}>주의 색면.</ColorBlock>
          <ColorBlock tone={RISK_COLOR.medium}>경고 색면.</ColorBlock>
          <ColorBlock tone="var(--hold)">보류 색면.</ColorBlock>
        </div>
      </Section>

      <Section title="BADGE — 색면 배지">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Badge tone={RISK_COLOR.medium} tnum>
            D-45
          </Badge>
          <Badge tone={RISK_COLOR.critical} tnum>
            D-14
          </Badge>
          <Badge tone={RISK_COLOR.critical}>기한 경과</Badge>
          <Badge tone="var(--hold)">보류</Badge>
          <Badge tone={RISK_COLOR.high} tnum>
            HIGH · D-45
          </Badge>
          <Badge tone="var(--accent)">내 우선순위</Badge>
        </div>
      </Section>

      <Section title="FILTERCHIP — 선택/비선택">
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {['내 우선순위', '전체', 'VN', 'HIGH+', '시행 임박'].map((f) => (
            <FilterChip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f}
            </FilterChip>
          ))}
        </div>
      </Section>

      <Section title="MARK — 한자 마커 3종 (serif 폴백)">
        <div style={{ display: 'flex', gap: 'var(--row-gap)', alignItems: 'center' }}>
          <Mark status="active" />
          <Mark status="hold" />
          <Mark status="scheduled" />
          <span className="t-meta" style={{ color: 'var(--text-3)' }}>
            좌측 3개가 컴포넌트(serif) — 본문 글꼴로 쓰면 施 留 豫
          </span>
        </div>
      </Section>

      <Section title="RISKTEXT — 위험도 글자색">
        <span className="t-meta tnum" style={{ color: 'var(--text-3)' }}>
          <RiskText level="critical" /> · <RiskText level="high" /> ·{' '}
          <RiskText level="medium" /> · <RiskText level="low" />
        </span>
      </Section>

      <Section title="ROW — LAW 92px">
        <Row
          height="law"
          leading={<Mark status="active" />}
          leadingAlign="top"
          trailing={
            <Badge tone={RISK_COLOR.medium} tnum>
              D-45
            </Badge>
          }
          onClick={() => {}}
        >
          <Label>DECREE 37/2026</Label>
          <RowTitle>식품 라벨 표시 규정 전면 개정</RowTitle>
          <RowMeta>
            2026.01.23 시행 · 제품 4 · 액션 4 · <RiskText level="high" />
          </RowMeta>
        </Row>
        <Row
          height="law"
          leading={<Mark status="hold" />}
          leadingAlign="top"
          trailing={<Badge tone="var(--hold)">보류</Badge>}
          dimmed
          last
          onClick={() => {}}
        >
          <Label>DECREE 46/2026</Label>
          <RowTitle>식품안전법 시행령 개정</RowTitle>
          <RowMeta>
            2026.04.06 보류 · 제품 4 · 액션 0 · <RiskText level="medium" />
          </RowMeta>
        </Row>
      </Section>

      <Section title="ROW — ACTION 66px · 순번">
        <Row
          height="action"
          leading={<Ordinal n={1} />}
          leadingAlign="top"
          trailing={
            <Badge tone={RISK_COLOR.medium} tnum>
              D-45
            </Badge>
          }
        >
          <span className="t-body" style={{ color: 'var(--text)' }}>
            라벨 시안 재설계 (원산지 영문표기)
          </span>
          <Label>DECREE 37/2026</Label>
        </Row>
        <Row
          height="action"
          leading={<Ordinal n={2} />}
          leadingAlign="top"
          trailing={<Badge tone={RISK_COLOR.critical}>기한 경과</Badge>}
          last
        >
          <span className="t-body" style={{ color: 'var(--text)' }}>
            영양성분 시험성적서 확보
          </span>
          <Label>CIRCULAR 29/2023</Label>
        </Row>
      </Section>

      <Section title="ROW — ACTION 66px · 체크박스">
        {TASKS.map((t, i) => (
          <Row
            key={t}
            height="action"
            leading={<Checkbox checked={checked[i]} onChange={tick(i)} label={t} />}
            leadingAlign="top"
            last={i === TASKS.length - 1}
          >
            <span
              className="t-body"
              style={{
                color: checked[i] ? 'var(--text-3)' : 'var(--text)',
                textDecoration: checked[i] ? 'line-through' : undefined,
              }}
            >
              {t}
            </span>
            <RowMeta>품질팀 · 2주 · ~10.15</RowMeta>
          </Row>
        ))}
      </Section>

      <Section title="ROW — INFO 62px">
        <Row height="info" leading={<Mark status="active" />}>
          <RowTitle>식품 라벨 표시 규정 전면 개정</RowTitle>
          <RowMeta>
            2026.01.23 · 제품 4 · <RiskText level="high" />
          </RowMeta>
        </Row>
        <Row height="info" leading={<Mark status="active" />} last>
          <RowTitle>생산자책임재활용(EPR) 시행</RowTitle>
          <RowMeta>
            2026.05.25 · 제품 4 · <RiskText level="critical" />
          </RowMeta>
        </Row>
      </Section>

      <Section title="ROW — SHORT 44px · 상태 스트립 (마커 자연폭)">
        <Row
          height="short"
          leading={<Mark status="hold" fixedWidth={false} />}
          trailing={
            <span className="t-meta tnum" style={{ flex: 'none', color: 'var(--text-3)' }}>
              04.06
            </span>
          }
          last
        >
          <RowTitle as="span">DECREE 46/2026 시행 보류</RowTitle>
        </Row>
      </Section>

      <Section title="ROW — SHORT 44px · 제품 행">
        {PRODUCTS.map(([name, hs, risk], i) => (
          <Row
            key={name}
            height="short"
            trailing={
              <>
                <span className="t-meta tnum" style={{ flex: 'none', color: 'var(--text-3)' }}>
                  HS {hs}
                </span>
                <span className="t-meta" style={{ flex: 'none', width: 64, textAlign: 'right' }}>
                  <RiskText level={risk} />
                </span>
              </>
            }
            last={i === PRODUCTS.length - 1}
          >
            <RowTitle as="span">{name}</RowTitle>
          </Row>
        ))}
      </Section>

      <Section title="STATUS_COLOR 대조">
        <span className="t-meta" style={{ color: 'var(--text-3)' }}>
          active {STATUS_COLOR.active} · hold {STATUS_COLOR.hold} · scheduled{' '}
          {STATUS_COLOR.scheduled}
        </span>
      </Section>

      <TabBar />
    </div>
  );
}
