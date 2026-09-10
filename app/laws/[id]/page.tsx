import { notFound } from 'next/navigation';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { InfoRow } from '@/components/Row';
import { Screen, Section } from '@/components/Screen';
import { IconButton, TopBar } from '@/components/TopBar';
import { actionsOfLaw, allLaws, countryByCode, lawById } from '@/lib/data';
import { formatDate } from '@/lib/dday';
import { RISK_LABEL } from '@/types/neo';
import { Affected } from './Affected';
import { HeaderBadge } from './HeaderBadge';
import { MustDoList } from './MustDoList';
import { OpenActionsBar } from './OpenActionsBar';
import { SaveToggle } from './SaveToggle';

// 12조합 전부의 법령을 정적 생성한다. 프로필을 바꾸면 다른 조합의 상세로 들어간다.
export function generateStaticParams() {
  return allLaws.map((law) => ({ id: law.id }));
}

/**
 * S3 법령 상세.
 *
 * 서버 컴포넌트로 남긴다 — 본문은 법령 id 하나로 정해지고 프로필과 무관하다.
 * 프로필에 매인 것(해야 할 일, 영향받는 제품, 하단 CTA)과 날짜에 매인 것(상태 배지)만
 * 클라이언트 조각으로 떼어냈다.
 */
export default async function LawDetail({ params }: PageProps<'/laws/[id]'>) {
  const { id } = await params;
  const law = lawById(id);
  if (!law) notFound();

  const actions = actionsOfLaw(law);
  const country = countryByCode(law.country);

  return (
    <Screen
      // CTA가 있을 수 있으면 여백을 잡는다. 실제로 그릴지는 미완 액션 수에 달렸고
      // 그 판단은 클라이언트에 있다 — 여백까지 거기 맡기면 레이아웃이 흔들린다.
      scrollPadBottom={actions.length > 0 ? 'var(--pad-cta)' : 'var(--pad-plain)'}
      footer={actions.length > 0 ? <OpenActionsBar law={law} /> : undefined}
    >
      <TopBar
        inset={16}
        left={<IconButton icon="chevron-left" label="규제 목록으로" href="/laws" stroke={2} />}
        right={<SaveToggle lawId={law.id} />}
      />

      <div style={{ padding: '4px var(--pad) 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="t-caption tnum" style={{ color: 'var(--tds-fg-quaternary)' }}>
            {law.officialRef}
          </span>
          <h1 className="t-h1">{law.title}</h1>
          <span className="t-meta tnum" style={{ color: 'var(--tds-fg-tertiary)' }}>
            {country ? `${country.code} ${country.nameKo} · ` : ''}
            {formatDate(law.effectiveDate)} 시행
          </span>
          {/* 위험도 · 상태 · 출처. 1차 출처(관보)만 브랜드 배지를 단다 —
              2차 출처를 1차인 척하지 않는다. */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
            <Badge tone={law.riskLevel}>{RISK_LABEL[law.riskLevel]}</Badge>
            <HeaderBadge law={law} />
            {law.sourceTier === 'official' ? (
              <Badge tone="brand">관보</Badge>
            ) : (
              <Badge tone="neutral">2차 출처</Badge>
            )}
          </div>
        </div>

        {law.transitionNote && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: 16,
              borderRadius: 'var(--r-xl)',
              background: 'var(--tds-bg-brand-weak)',
            }}
          >
            <span className="t-label" style={{ color: 'var(--tds-fg-brand)' }}>
              경과규정
            </span>
            <span className="t-body tnum" style={{ color: 'var(--tds-fg-secondary)' }}>
              {law.transitionNote}
            </span>
          </div>
        )}

        {/* ★ 해야 할 일이 무엇이 바뀌었나보다 위에 온다. 이 앱은 법률을 설명하는 앱이
            아니라 행동을 시키는 앱이다. 순서를 바꾸지 말 것.
            섹션 제목까지 MustDoList가 그린다 — 액션 수가 품목에 따라 달라지는데
            서버는 사용자의 품목을 모른다. */}
        <MustDoList law={law} />

        {law.changes.length > 0 && (
          <Section title="무엇이 바뀌었나">
            <Card padding="16px 20px" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {law.changes.map((change, i) => (
                <div
                  key={change.before}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    paddingTop: i > 0 ? 16 : undefined,
                    borderTop: i > 0 ? '1px solid var(--tds-line-default)' : undefined,
                  }}
                >
                  <ChangeLine tag="이전" before>
                    {change.before}
                  </ChangeLine>
                  <ChangeLine tag="개정">{change.after}</ChangeLine>
                </div>
              ))}
            </Card>
          </Section>
        )}

        <Affected law={law} />

        <Section title="출처">
          <Card>
            <InfoRow label="발행">{law.source.publisher}</InfoRow>
            <InfoRow label="공포일">{formatDate(law.source.publishedAt)}</InfoRow>
            {/* 실제로 그 URL을 열어 확인한 날이다. */}
            <InfoRow label="최종 확인">{formatDate(law.source.lastVerified)}</InfoRow>
            {/* 원문 링크. 번역 데이터가 없으므로 번역 링크는 그리지 않는다 —
                데이터가 없으면 표시하지 않는다. */}
            <a
              href={law.source.url}
              target="_blank"
              rel="noreferrer noopener"
              style={{
                height: 52,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <span className="t-body-b" style={{ lineHeight: 1 }}>
                원문 보기 · {law.source.originalLang.toUpperCase()}
              </span>
              <Icon name="chevron-right" size={18} stroke={2} />
            </a>
          </Card>
        </Section>
      </div>
    </Screen>
  );
}

/** 바뀐 내용 한 줄. 작은 꼬리표(이전/개정) 아래 본문. 이전 내용은 흐리게 긋는다. */
function ChangeLine({
  tag,
  before = false,
  children,
}: {
  tag: string;
  before?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span
        style={{
          alignSelf: 'flex-start',
          height: 20,
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0 6px',
          borderRadius: 5,
          background: before ? 'var(--tds-bg-secondary)' : 'var(--tds-bg-brand-weak)',
          color: before ? 'var(--tds-fg-tertiary)' : 'var(--tds-fg-brand)',
          font: '600 11px/1 var(--font)',
        }}
      >
        {tag}
      </span>
      <span
        className="t-body tnum"
        style={{
          color: before ? 'var(--tds-fg-tertiary)' : undefined,
          textDecoration: before ? 'line-through' : undefined,
        }}
      >
        {children}
      </span>
    </div>
  );
}
