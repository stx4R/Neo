'use client';

// 부품 대조용. 디자인 원본의 01 Tokens · 02 Components 판을 앱 부품으로 다시 늘어놓는다.
// 라이트·다크는 기기 설정을 따른다 — 둘 다 보려면 OS 테마를 바꿔 본다.

import { useState } from 'react';
import { Badge, Chip } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Checkbox } from '@/components/Checkbox';
import { DotGeo } from '@/components/DotGeo';
import { SearchField, TextField } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { IconTile } from '@/components/IconTile';
import { ProgressBar } from '@/components/ProgressBar';
import { Row } from '@/components/Row';
import { Screen, Section } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { TopBar } from '@/components/TopBar';
import { RISK_LABEL, type RiskLevel } from '@/types/neo';

const RISKS: RiskLevel[] = ['critical', 'high', 'medium', 'low'];
const TASKS = ['포장재 중량 산정 자료 제출', '재활용 계획 등록 결정'];

export default function KitchenSink() {
  const [checked, setChecked] = useState([true, false]);
  const [chip, setChip] = useState('내 우선순위');
  const [query, setQuery] = useState('');
  const [hs, setHs] = useState('340');

  return (
    <Screen bg="canvas" scrollPadBottom="var(--pad-tabbar)" footer={<TabBar />}>
      <TopBar left={<span className="t-appbar">부품</span>} />

      <div style={{ padding: '8px var(--pad) 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Section title="배지">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {RISKS.map((r) => (
              <Badge key={r} tone={r}>
                {RISK_LABEL[r]}
              </Badge>
            ))}
            <Badge tone="neutral">시행중</Badge>
            <Badge tone="medium">보류</Badge>
            <Badge tone="brand">관보</Badge>
            <Badge tone="medium" tnum>
              D-433
            </Badge>
          </div>
        </Section>

        <Section title="버튼">
          <Button size="xl" block>
            액션 5건 확인하기
          </Button>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary">편집</Button>
            <Button variant="ghost">전체보기</Button>
            <Button size="s" disabled>
              비활성
            </Button>
          </div>
        </Section>

        <Section title="칩 · 검색 · 입력">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['내 우선순위', '전체', '저장됨'].map((c) => (
              <Chip key={c} active={chip === c} onClick={() => setChip(c)}>
                {c}
              </Chip>
            ))}
          </div>
          <SearchField value={query} onChange={setQuery} placeholder="법령명, 제품, 키워드" ariaLabel="검색" />
          <TextField value={hs} onChange={setHs} ariaLabel="HS코드" invalid tnum width={104} />
        </Section>

        <Section title="목록 · 체크박스">
          <Card>
            <Row
              leading={
                <IconTile tone="high">
                  <Icon name="scroll" size={22} />
                </IconTile>
              }
              trailing={
                <Badge tone="medium" tnum>
                  D-500
                </Badge>
              }
            >
              <span className="t-subtitle">상품 라벨 규정</span>
              <span className="t-meta tnum" style={{ color: 'var(--tds-fg-tertiary)' }}>
                미완 2 · 제품 4
              </span>
            </Row>
            {TASKS.map((t, i) => (
              <Row
                key={t}
                divider={i < TASKS.length - 1}
                leading={
                  <Checkbox
                    checked={checked[i]}
                    onChange={(v) => setChecked((prev) => prev.map((c, j) => (j === i ? v : c)))}
                    label={t}
                  />
                }
              >
                <span
                  className="t-body"
                  style={{
                    color: checked[i] ? 'var(--tds-fg-tertiary)' : undefined,
                    textDecoration: checked[i] ? 'line-through' : undefined,
                  }}
                >
                  {t}
                </span>
              </Row>
            ))}
          </Card>
        </Section>

        <Section title="진행">
          <ProgressBar value={0.71} label="진행" />
        </Section>

        <Section title="지오그래피">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
              <DotGeo mode="globe" dotColor="var(--geo-dot-globe)" showError={false} />
            </div>
            <div style={{ flex: 1, height: 200 }}>
              <DotGeo mode="asia" dotColor="var(--geo-dot)" />
            </div>
          </div>
        </Section>
      </div>
    </Screen>
  );
}
