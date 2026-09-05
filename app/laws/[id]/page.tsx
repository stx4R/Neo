import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Label } from '@/components/Label';
import { Screen, Section } from '@/components/Screen';
import { TopBar } from '@/components/TopBar';
import { actionsOfLaw, allLaws, countryByCode, lawById } from '@/lib/data';
import { formatDate } from '@/lib/dday';
import { Affected } from './Affected';
import { HeaderBadge } from './HeaderBadge';
import { MustDoList } from './MustDoList';
import { OpenActionsBar } from './OpenActionsBar';

// 12조합 전부의 법령을 정적 생성한다. 프로필을 바꾸면 다른 조합의 상세로 들어간다.
export function generateStaticParams() {
  return allLaws.map((law) => ({ id: law.id }));
}

/**
 * S3 법령 상세.
 *
 * 서버 컴포넌트로 남긴다 — 본문은 법령 id 하나로 정해지고 프로필과 무관하다.
 * 프로필에 매인 것은 영향 제품(AFFECTED)과 하단 바뿐이라 그 둘만 클라이언트다.
 */
export default async function LawDetail({ params }: PageProps<'/laws/[id]'>) {
  const { id } = await params;
  const law = lawById(id);
  if (!law) notFound();

  const actions = actionsOfLaw(law);
  const country = countryByCode(law.country);

  return (
    <Screen
      // 바가 있을 수 있으면 여백을 잡는다. 실제로 그릴지는 미완 액션 수에 달렸고
      // 그 판단은 클라이언트에 있다 — 여백까지 거기 맡기면 레이아웃이 흔들린다.
      scrollPadBottom={actions.length > 0 ? 'var(--pad-ctabar)' : 'var(--pad-plain)'}
      footer={actions.length > 0 ? <OpenActionsBar law={law} /> : undefined}
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
          {law.title}
        </h1>
        <p className="t-meta tnum" style={{ margin: '10px 0 0', color: 'var(--text-2)' }}>
          {country ? `${country.code} ${country.nameKo} · ` : ''}
          {formatDate(law.effectiveDate)} 시행
        </p>
        <div style={{ marginTop: 12, display: 'flex' }}>
          <HeaderBadge law={law} />
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

      <Affected law={law} />

      <Section label="SOURCE">
        {/* S9 SOURCE TIER 안 1 — 1차 출처만 색면 배지를 단다.
            2차 출처는 Label로만 적는다. 2차를 1차인 척하지 않는다.
            좌측 1·2 등급 열(안 2)은 기각했다 — DISCREPANCIES §60. */}
        <div
          style={{
            height: 44,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--row-gap)',
            borderTop: '1px solid var(--hairline)',
            borderBottom: '1px solid var(--hairline)',
          }}
        >
          <span
            className="t-body tnum"
            style={{ flex: 1, minWidth: 0, color: 'var(--text)' }}
          >
            {law.officialRef}
          </span>
          {law.sourceTier === 'official' ? (
            <span
              className="t-badge"
              style={{
                flex: 'none',
                height: 'var(--badge-h)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 var(--badge-pad)',
                background: 'var(--accent)',
                color: 'var(--on-color)',
              }}
            >
              관보
            </span>
          ) : (
            <span className="t-label" style={{ flex: 'none', color: 'var(--text-3)' }}>
              2차 출처
            </span>
          )}
        </div>

        <div
          style={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--stack)',
          }}
        >
          <span className="t-meta tnum" style={{ color: 'var(--text-3)' }}>
            {law.source.publisher} · {formatDate(law.source.publishedAt)} 공포
          </span>
          {/* 네가 실제로 그 URL을 열어 확인한 날이다. */}
          <span className="t-meta tnum" style={{ color: 'var(--text-3)' }}>
            최종 확인 {formatDate(law.source.lastVerified)}
          </span>
        </div>

        {/* 원문 링크. 번역 데이터가 없으므로 "번역 KO"는 그리지 않는다 —
            데이터가 없으면 표시하지 않는다. */}
        <div style={{ marginTop: 12 }}>
          <a
            className="t-body"
            href={law.source.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            원문 {law.source.originalLang.toUpperCase()}
          </a>
        </div>
      </Section>

    </Screen>
  );
}
