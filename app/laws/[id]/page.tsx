import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/Badge';
import { Label } from '@/components/Label';
import { RiskText } from '@/components/RiskText';
import { Row, RowTitle } from '@/components/Row';
import { Screen, Section } from '@/components/Screen';
import { TopBar } from '@/components/TopBar';
import { actionsOfLaw, company, laws, productsOfLaw } from '@/lib/data';
import { formatDate } from '@/lib/dday';
import { headerBadge } from '@/lib/derive';
import { RISK_COLOR } from '@/types/neo';
import { MustDoList } from './MustDoList';

export function generateStaticParams() {
  return laws.map((law) => ({ id: law.id }));
}

export default async function LawDetail({ params }: PageProps<'/laws/[id]'>) {
  const { id } = await params;
  const law = laws.find((l) => l.id === id);
  if (!law) notFound();

  const actions = actionsOfLaw(law);
  const products = productsOfLaw(law);
  const badge = headerBadge(law);
  const activeCountry = company.countries.find((c) => c.code === law.country);

  return (
    <Screen
      scrollPadBottom={actions.length > 0 ? 140 : 40}
      footer={actions.length > 0 ? <AddActionsBar count={actions.length} /> : undefined}
    >
      <TopBar
        left={
          <Link
            href="/laws"
            aria-label="법률 목록으로"
            style={{
              font: '400 20px/1 Pretendard, sans-serif',
              color: 'var(--text)',
              textDecoration: 'none',
            }}
          >
            ←
          </Link>
        }
        right={
          // TODO 6단계: 저장 동작. 지금은 자리만 잡는다.
          <span className="t-meta" style={{ color: 'var(--text-3)', cursor: 'pointer' }}>
            저장
          </span>
        }
      />

      <div style={{ padding: '12px var(--pad) 0' }}>
        <Label>{law.officialRef}</Label>
        <h1 className="t-h1" style={{ margin: '8px 0 0', color: 'var(--text)' }}>
          {law.title}.
        </h1>
        <p className="t-meta tnum" style={{ margin: '10px 0 0', color: 'var(--text-2)' }}>
          {activeCountry ? `${activeCountry.code} ${activeCountry.name} · ` : ''}
          {formatDate(law.effectiveDate)} 시행
        </p>
        <div style={{ marginTop: 12, display: 'flex' }}>
          <Badge tone={badge.tone} tnum={badge.tnum}>
            {badge.text}
          </Badge>
        </div>
      </div>

      {/* 경과규정 — 박스가 아니라 좌측 3px 실선 하나. */}
      {law.transitionNote && (
        <div style={{ marginTop: 'var(--sec-gap)', padding: '0 var(--pad)' }}>
          <div
            style={{
              borderLeft: '3px solid var(--accent)',
              paddingLeft: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--stack)',
            }}
          >
            <Label>경과규정</Label>
            <span className="t-body tnum" style={{ color: 'var(--text)' }}>
              {law.transitionNote}
            </span>
          </div>
        </div>
      )}

      {/* ★ MUST DO가 WHAT CHANGED보다 위에 온다. 이 앱은 법률을 설명하는 앱이 아니라
          행동을 시키는 앱이다. 순서를 바꾸지 말 것. */}
      {actions.length > 0 && (
        <Section label={`MUST DO — ${actions.length}`}>
          <MustDoList actions={actions} />
        </Section>
      )}

      {law.changes.length > 0 && (
        <Section label="WHAT CHANGED">
          {law.changes.map((change, i) => (
            <div
              key={change.before}
              style={{
                padding: '14px 0',
                borderTop: '1px solid var(--hairline)',
                borderBottom:
                  i === law.changes.length - 1 ? '1px solid var(--hairline)' : undefined,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--stack)' }}>
                <Label>BEFORE</Label>
                <span
                  className="t-body"
                  style={{ color: 'var(--text-3)', textDecoration: 'line-through' }}
                >
                  {change.before}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--stack)' }}>
                <Label color="var(--accent)">AFTER</Label>
                <span className="t-body" style={{ color: 'var(--text)' }}>
                  {change.after}
                </span>
              </div>
            </div>
          ))}
        </Section>
      )}

      {products.length > 0 && (
        <Section label={`AFFECTED — ${products.length}`}>
          {products.map((product, i) => (
            <Row
              key={product.id}
              height="short"
              last={i === products.length - 1}
              trailing={
                <>
                  <span
                    className="t-meta tnum"
                    style={{ flex: 'none', color: 'var(--text-3)' }}
                  >
                    HS {product.hsCode}
                  </span>
                  <span
                    className="t-meta"
                    style={{ flex: 'none', width: 64, textAlign: 'right' }}
                  >
                    <RiskText level={product.impact} />
                  </span>
                </>
              }
            >
              <RowTitle as="span">{product.name}</RowTitle>
            </Row>
          ))}
        </Section>
      )}

      <Section label="SOURCE">
        {/* 언어 토글. 번역 데이터가 없으므로 지금은 표시만 한다.
            TODO 6단계 이후: 원문 링크 또는 번역 연결. */}
        <div style={{ display: 'flex', gap: 12 }}>
          <span
            className="t-meta"
            style={{ color: 'var(--text)', textDecoration: 'underline', cursor: 'pointer' }}
          >
            원문 {law.country}
          </span>
          <span className="t-meta" style={{ color: 'var(--text-3)', cursor: 'pointer' }}>
            번역 KO
          </span>
        </div>
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--stack)',
          }}
        >
          <span className="t-body tnum" style={{ color: 'var(--text)' }}>
            {law.officialRef}
          </span>
          <span className="t-meta tnum" style={{ color: 'var(--text-3)' }}>
            {law.source.publisher} · {formatDate(law.source.publishedAt)} 공포
          </span>
          <span className="t-meta tnum" style={{ color: RISK_COLOR.low }}>
            최종 확인 {formatDate(law.source.lastVerified)}
          </span>
        </div>
      </Section>
    </Screen>
  );
}

function AddActionsBar({ count }: { count: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
        height: 56,
        padding: '0 var(--pad)',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg)',
        borderTop: '1px solid var(--hairline)',
      }}
    >
      {/* TODO 6단계: 담기 동작 연결. 지금은 렌더만 한다. */}
      <button
        type="button"
        style={{
          width: '100%',
          height: 44,
          display: 'flex',
          alignItems: 'center',
          padding: '0 var(--block-pad)',
          border: 'none',
          background: 'var(--accent)',
          cursor: 'pointer',
        }}
      >
        <span className="t-h2" style={{ color: 'var(--on-color)' }}>
          액션 {count}건 담기
        </span>
      </button>
    </div>
  );
}
