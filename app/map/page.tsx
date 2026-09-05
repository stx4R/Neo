'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/Badge';
import { DotGeo, type Projector } from '@/components/DotGeo';
import { Label } from '@/components/Label';
import { Mark } from '@/components/Mark';
import { Row, RowTitle } from '@/components/Row';
import { Screen } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { TopBar } from '@/components/TopBar';
import { company } from '@/lib/data';
import {
  countryRisk,
  lawsOfCountry,
  listBadge,
  markColor,
  openActionCountOfCountry,
  sheetLaws,
} from '@/lib/derive';
import { useActionsDone } from '@/lib/useActionsDone';
import { RISK_COLOR, RISK_LABEL } from '@/types/neo';

interface MarkerSpec {
  code: string;
  coord: [number, number];
  /** 0이면 캔버스가 이미 찍은 점이다 — HTML 정사각을 겹쳐 그리지 않는다. */
  size: number;
  labelColor: string;
}

/**
 * 국가 마커. 좌표와 형태는 아트보드 COUNTRIES 그대로다.
 * KR·VN이 size 0인 이유 — DotGeo가 항로 출발점에 4×4 흰 정사각을,
 * 도착점에 6×6 --risk-critical 정사각을 이미 그린다.
 * 원형 도트는 없다. 전부 정사각이다.
 */
const MARKERS: MarkerSpec[] = [
  { code: 'KR', coord: [127.8, 36.2], size: 0, labelColor: 'var(--text-3)' },
  { code: 'VN', coord: [105.9, 20.9], size: 0, labelColor: 'var(--text)' },
  { code: 'ID', coord: [113.9, -2.5], size: 4, labelColor: 'var(--text-3)' },
  { code: 'TH', coord: [100.9, 15.2], size: 4, labelColor: 'var(--text-3)' },
];

/**
 * 마커 문구. company.json에서 파생한다 — 활성 국가면 위험도, 아니면 "곧 지원".
 * KR은 출발지라 company.countries에 없다. 그래서 여기만 상수다.
 */
function markerLabel(code: string): string {
  if (code === 'KR') return 'KR · 출발';
  const country = company.countries.find((c) => c.code === code);
  if (!country) return code;
  if (!country.active) return `${code} · 곧 지원`;
  const risk = countryRisk(code);
  return risk ? `${code} · ${RISK_LABEL[risk]}` : code;
}

// S5 Map.
export default function MapPage() {
  const done = useActionsDone();

  // 지도 박스 안의 마커 픽셀 좌표. DotGeo가 다시 그릴 때마다 갱신되므로
  // 창 크기를 바꿔도 마커가 점을 따라간다.
  const [points, setPoints] = useState<([number, number] | null)[]>([]);
  const handleProject = (project: Projector) => {
    setPoints(MARKERS.map((m) => project(m.coord)));
  };

  // 시트는 활성 국가 하나를 말한다. 지금 데이터에서는 VN 하나뿐이다.
  const focus = company.countries.find((c) => c.active) ?? company.countries[0];
  const countryLaws = lawsOfCountry(focus.code);
  const rows = sheetLaws(focus.code, done);
  const openCount = openActionCountOfCountry(focus.code, done);
  const risk = countryRisk(focus.code);

  const sheet = (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 418,
        zIndex: 4,
        background: 'var(--surface)',
        borderTop: '1px solid var(--hairline)',
      }}
    >
      {/* 드래그 핸들. 이 화면의 유일한 중앙 정렬이다.
          시각 요소로만 둔다 — 드래그로 펼친 뒤의 상태가 명세에 없고, 시트 내용이
          418px에 정확히 맞아 확장할 것이 없다. 그래서 vaul을 쓰지 않는다. */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 0' }}>
        <div style={{ width: 36, height: 3, background: 'var(--text-3)' }} />
      </div>

      <div style={{ padding: '10px var(--pad) 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 className="t-h1" style={{ margin: 0, color: 'var(--text)' }}>
            {focus.name}
          </h1>
          {risk && <Badge tone={RISK_COLOR[risk]}>{RISK_LABEL[risk]}</Badge>}
        </div>
        <p className="t-meta tnum" style={{ margin: '10px 0 0', color: 'var(--text-3)' }}>
          규제 {countryLaws.length} · 미완 액션 {openCount}
        </p>

        {rows.length > 0 ? (
          <div style={{ marginTop: 20 }}>
            {rows.map((law, i) => {
              const badge = listBadge(law);
              return (
                <Row
                  key={law.id}
                  height="info"
                  href={`/laws/${law.id}`}
                  leading={<Mark status={law.status} color={markColor(law)} />}
                  trailing={
                    badge && (
                      <Badge tone={badge.tone} tnum={badge.tnum}>
                        {badge.text}
                      </Badge>
                    )
                  }
                  last={i === rows.length - 1}
                >
                  <Label>{law.officialRef}</Label>
                  <RowTitle>{law.title}</RowTitle>
                </Row>
              );
            })}
          </div>
        ) : (
          <p className="t-meta" style={{ margin: '20px 0 0', color: 'var(--text-3)' }}>
            대응이 필요한 법률이 없습니다
          </p>
        )}

        <div style={{ marginTop: 12 }}>
          <Link href="/laws" className="t-body">
            법률 {countryLaws.length}건 모두 보기
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <Screen
      scrollPadBottom={0}
      footer={
        <>
          {sheet}
          <TabBar />
        </>
      }
    >
      {/* 상단바·검색이 지도 위에 앉는다. 지도가 DOM 뒤라 z-index로 올린다. */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        <TopBar
          left={<Label color="var(--text)">NEO</Label>}
          right={
            <span className="t-meta" style={{ color: 'var(--text-3)' }}>
              필터
            </span>
          }
        />
        {/* 검색 — 비기능이다. 지원 국가가 VN 하나뿐이라 거를 것이 없다.
            아트보드도 span이고 cursor를 주지 않는다. */}
        <div style={{ padding: '0 var(--pad)' }}>
          <div
            style={{
              height: 44,
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid var(--hairline)',
            }}
          >
            <span className="t-body" style={{ color: 'var(--text-3)' }}>
              국가 검색
            </span>
          </div>
        </div>
      </div>

      {/* 지도. 330×366을 우측 밖으로 흘린다 — S1 지구본과 같은 어법이다.
          가운데 정렬하지 않는다. 좌측에 여백이 남는 비대칭이 의도다.
          아트보드의 top:60은 화면 좌표다. Screen이 상단 44px을 이미 잡으므로
          콘텐츠 좌표로는 16px이 된다. */}
      <div style={{ position: 'absolute', top: 16, right: -36, width: 330, height: 366 }}>
        <DotGeo mode="asia" dotColor="var(--geo-dot)" onProject={handleProject} />
        {MARKERS.map((m, i) => {
          const xy = points[i];
          if (!xy) return null;
          return (
            <div
              key={m.code}
              style={{
                position: 'absolute',
                left: Math.round(xy[0]),
                top: Math.round(xy[1]),
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              {m.size > 0 && (
                <span
                  style={{
                    display: 'block',
                    width: m.size,
                    height: m.size,
                    background: 'var(--text-3)',
                  }}
                />
              )}
              <span
                className="t-label"
                style={{
                  marginLeft: m.size ? 0 : 9,
                  whiteSpace: 'nowrap',
                  color: m.labelColor,
                }}
              >
                {markerLabel(m.code)}
              </span>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
