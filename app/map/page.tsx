'use client';

import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { Badge } from '@/components/Badge';
import { DotGeo, type Projector } from '@/components/DotGeo';
import { Label } from '@/components/Label';
import { Mark } from '@/components/Mark';
import { Row, RowTitle } from '@/components/Row';
import { Screen } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { TopBar } from '@/components/TopBar';
import { countries, countryByCode } from '@/lib/data';
import { useDataset } from '@/lib/dataset';
import {
  countryRisk,
  lawsOfCountry,
  listBadge,
  markColor,
  openActionCountOfCountry,
  sheetLaws,
} from '@/lib/derive';
import { useActionsDone } from '@/lib/useActionsDone';
import { saveProfile } from '@/lib/useProfile';
import { RISK_COLOR, RISK_LABEL, type CountryInfo } from '@/types/neo';

/**
 * 지도 마커는 countries.json에서 나온다 — 좌표를 가진 국가 전부다.
 * 규격은 S9 MAP MARKER 실측이다.
 *
 *   지원 국가   6×6 위험도 색
 *   출발국      4×4 --text
 *   지원 예정   4×4 --text-3 + `지원 예정`
 *
 * 항로의 출발점·도착점은 DotGeo가 캔버스에 이미 찍으므로 그 두 국가에는
 * HTML 정사각을 겹쳐 그리지 않는다(size 0). 원형 도트는 없다. 전부 정사각이다.
 * 마커와 라벨 사이는 --marker-gap.
 */
interface MarkerSpec {
  country: CountryInfo;
  size: number;
  color: string;
  labelColor: string;
  label: string;
}

// S5 Map.
/**
 * 조사 '로/으로'를 붙인다. 받침이 없거나 받침이 ㄹ이면 '로', 아니면 '으로'다.
 * 국가명이 데이터에서 오므로 문장에 고정할 수 없다 —
 * "일본로", "미국로"가 그대로 화면에 나간다.
 */
function withRo(word: string): string {
  const last = word.charCodeAt(word.length - 1);
  // 한글 음절이 아니면 판단하지 않고 '로'를 쓴다. 지금 데이터는 전부 한글이다.
  if (last < 0xac00 || last > 0xd7a3) return `${word}로`;
  const jong = (last - 0xac00) % 28;
  return jong === 0 || jong === 8 ? `${word}로` : `${word}으로`;
}

export default function MapPage() {
  const done = useActionsDone();
  const ds = useDataset();

  // 지도 박스 안의 마커 픽셀 좌표. DotGeo가 다시 그릴 때마다 갱신되므로
  // 창 크기를 바꿔도 마커가 점을 따라간다.
  const [points, setPoints] = useState<([number, number] | null)[]>([]);
  // 지원 국가 마커를 탭했을 때 "도착국을 바꿀까요"를 묻는 상대. 모달이 아니다.
  const [ask, setAsk] = useState<CountryInfo | null>(null);
  // 시트는 프로필의 도착국 하나를 말한다.
  const focus = ds?.country;
  const origin = ds ? countryByCode(ds.profile.originCountry) : undefined;
  const countryLaws = ds && focus ? lawsOfCountry(ds, focus.code) : [];
  const rows = ds && focus ? sheetLaws(ds, focus.code, done) : [];
  const openCount = ds && focus ? openActionCountOfCountry(ds, focus.code, done) : 0;
  const risk = ds && focus ? countryRisk(ds, focus.code) : null;

  const markers: MarkerSpec[] = useMemo(() => {
    if (!ds) return [];
    const destCode = ds.profile.destinationCountry;
    const originCode = ds.profile.originCountry;
    const destRisk = focus ? countryRisk(ds, focus.code) : null;
    return countries
      .filter((c) => c.destination || c.code === originCode)
      .map((c) => {
        if (c.code === originCode) {
          return {
            country: c,
            // 항로 출발점은 캔버스가 이미 찍는다.
            size: c.code === destCode ? 0 : 4,
            color: 'var(--text)',
            labelColor: 'var(--text-3)',
            label: `${c.code} · 출발`,
          };
        }
        if (!c.supported) {
          return {
            country: c,
            size: 4,
            color: 'var(--text-3)',
            labelColor: 'var(--text-3)',
            label: `${c.code} · 지원 예정`,
          };
        }
        const isDest = c.code === destCode;
        const r = isDest ? destRisk : null;
        return {
          country: c,
          size: isDest ? 0 : 6,
          color: r ? RISK_COLOR[r] : 'var(--text)',
          labelColor: isDest ? 'var(--text)' : 'var(--text-3)',
          label: isDest && r ? `${c.code} · ${RISK_LABEL[r]}` : c.code,
        };
      });
  }, [ds, focus]);

  // DotGeo는 이 콜백을 ref에 담아 두고 매 렌더 갱신한다. 그래서 markers가 바뀌면
  // 다음 재생성 때 최신 목록으로 좌표를 뽑는다. markers가 바뀌는 유일한 계기는
  // 도착국 변경이고, 그때 DotGeo의 to도 같이 바뀌어 재생성이 걸린다.
  const handleProject = useCallback(
    (project: Projector) => {
      setPoints(markers.map((m) => project([m.country.lng, m.country.lat])));
    },
    [markers],
  );


  const confirmSwitch = ask && (
    <div
      role="status"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 'calc(418px + var(--safe-bottom))',
        zIndex: 6,
        minHeight: 'var(--block-h)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--row-gap)',
        padding: '0 var(--pad)',
        background: 'var(--risk-medium)',
      }}
    >
      <span className="t-body" style={{ flex: 1, minWidth: 0, color: 'var(--on-color)' }}>
        도착국을 {withRo(ask.nameKo)} 바꾸면 완료 표시가 초기화됩니다
      </span>
      <button
        type="button"
        className="t-body"
        onClick={() => {
          if (ds) {
            saveProfile({
              ...ds.profile,
              destinationCountry: ask.code,
              updatedAt: new Date().toISOString(),
            });
          }
          setAsk(null);
        }}
        style={{
          flex: 'none',
          padding: 0,
          border: 'none',
          background: 'transparent',
          color: 'var(--on-color)',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
      >
        바꾸기
      </button>
      <button
        type="button"
        className="t-meta"
        onClick={() => setAsk(null)}
        style={{
          flex: 'none',
          padding: 0,
          border: 'none',
          background: 'transparent',
          color: 'var(--on-color)',
          cursor: 'pointer',
        }}
      >
        취소
      </button>
    </div>
  );

  const sheet = (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        // 시트 위에 탭바가 겹쳐 앉는 구조는 유지한다. 다만 탭바가 안전영역만큼
        // 두꺼워지므로 시트도 같이 늘려야 마지막 행("법률 N건 모두 보기")이
        // 탭바 뒤로 들어가지 않는다. 418은 안전영역 0 기준 실측값이다.
        height: 'calc(418px + var(--safe-bottom))',
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
            {focus?.nameKo ?? ''}
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
      // 시트가 스크롤 영역을 통째로 덮는다. 하단 여백은 시트 쪽에서 잡는다.
      scrollPadBottom="0px"
      footer={
        <>
          {confirmSwitch}
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
          아트보드의 top:60은 화면 좌표다. Screen이 상단 상태바 자리를 이미 잡으므로
          콘텐츠 좌표로는 16px이 된다. */}
      <div style={{ position: 'absolute', top: 16, right: -36, width: 330, height: 366 }}>
        <DotGeo
          mode="asia"
          dotColor="var(--geo-dot)"
          from={origin ? [origin.lng, origin.lat] : undefined}
          to={focus ? [focus.lng, focus.lat] : undefined}
          onProject={handleProject}
        />
        {markers.map((m, i) => {
          const xy = points[i];
          if (!xy) return null;
          const selectable =
            m.country.supported && m.country.code !== ds?.profile.destinationCountry;
          return (
            <div
              key={m.country.code}
              style={{
                position: 'absolute',
                left: Math.round(xy[0]),
                top: Math.round(xy[1]),
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--marker-gap)',
                transform: 'translateY(-50%)',
                pointerEvents: selectable ? 'auto' : 'none',
              }}
            >
              {m.size > 0 && (
                <span
                  style={{ display: 'block', width: m.size, height: m.size, background: m.color }}
                />
              )}
              <button
                type="button"
                disabled={!selectable}
                onClick={() => selectable && setAsk(m.country)}
                className="t-label"
                style={{
                  marginLeft: m.size ? 0 : 9 + 6,
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  whiteSpace: 'nowrap',
                  color: m.labelColor,
                  cursor: selectable ? 'pointer' : 'default',
                }}
              >
                {m.label}
              </button>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
