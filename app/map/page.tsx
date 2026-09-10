'use client';

import Link from 'next/link';
import { useCallback, useMemo, useState, type CSSProperties } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { DotGeo, outsideArtboardBox, type Projector } from '@/components/DotGeo';
import { SearchField } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { Row } from '@/components/Row';
import { Screen } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { TopBar } from '@/components/TopBar';
import { countries, countryByCode } from '@/lib/data';
import { useDataset } from '@/lib/dataset';
import {
  countryRisk,
  lawBadge,
  lawsOfCountry,
  openActionCountOfCountry,
  sheetLaws,
} from '@/lib/derive';
import { useActionsDone } from '@/lib/useActionsDone';
import { saveProfile } from '@/lib/useProfile';
import { RISK_LABEL, type CountryInfo, type RiskLevel } from '@/types/neo';

/**
 * 지도 영역의 위 끝 — 상단바 56 + 검색 위 여백 4 + 검색 48 + 간격 16. 디자인 원본 실측.
 * 아래 끝은 시트 위 끝(--sheet-h)이다. 투영을 보이는 자리에만 맞춘다 —
 * 시트 뒤에 떨어진 마커는 보이지 않는다.
 */
const MAP_TOP = 124;

/**
 * 도착국 알약이 점 오른쪽으로 먹는 폭. 가장 긴 것이 `US · CRITICAL`이다 —
 * 글자 약 80 + 사이 6 + 점 반쪽 4 + 오른쪽 패딩 10에 여백을 더했다.
 * 도착점이 이 폭 안으로 들어오면 DotGeo가 축척을 줄인다(§166).
 */
const LABEL_ROOM = 112;

/**
 * 지도 마커는 countries.json에서 나온다 — 좌표를 가진 국가 전부다.
 * 모양은 알약 하나에 점 하나. 점의 중심이 국가 좌표에 앉는다.
 *
 *   origin     흰 알약 + 글자색 점 · `KR · 출발`
 *   dest       글자색으로 뒤집힌 알약 + 위험도 점 · `VN · CRITICAL`
 *   supported  흰 알약 + 흐린 점 · `JP` — 누르면 도착국을 바꿀지 묻는다
 *   planned    회색 알약, 그림자 없음 · `TH · 지원 예정`
 *
 * 다른 지원 국가의 점은 위험도 색이 아니다. 데이터셋은 도착국 하나의 법령만
 * 들고 있다 — 다른 나라의 위험도를 칠하려면 그 계산을 새로 만들어야 한다.
 */
type PinKind = 'origin' | 'dest' | 'supported' | 'planned';

interface Pin {
  country: CountryInfo;
  kind: PinKind;
  label: string;
  /** 자리가 모자랄 때 대신 쓰는 이름. 국가 코드 두 글자다. */
  short: string;
  risk: RiskLevel | null;
  /** 먼저 시도할 쪽. 기본은 오른쪽이고 출발국만 뒤집힐 수 있다. */
  side: 'left' | 'right';
}

/** 실제로 놓인 자리. label이 null이면 이름을 접고 점만 남긴 것이다. */
interface Placement {
  side: 'left' | 'right';
  label: string | null;
}

/** 이름을 먼저 받는 순서 — 도착국, 누를 수 있는 국가, 출발국, 지원 예정. */
const PRIORITY: Record<PinKind, number> = { dest: 0, supported: 1, origin: 2, planned: 3 };

/**
 * 알약끼리 이만큼은 떨어져야 겹치지 않은 것으로 본다. 세로는 더 너그럽다 —
 * VN 알약 바로 아래 TH 알약이 3px 틈으로 붙는데, 그 정도면 두 줄로 읽힌다.
 */
const PIN_GAP_X = 4;
const PIN_GAP_Y = 2;

type Box = [x0: number, y0: number, x1: number, y1: number];

/** 알약 치수. 점 6·8, 높이 28·30, 좌우 패딩 10, 점과 글자 사이 6. 디자인 원본 실측. */
function pinMetrics(kind: PinKind) {
  const planned = kind === 'planned';
  const dot = planned ? 6 : 8;
  return {
    dot,
    height: planned ? 28 : 30,
    weight: planned ? 500 : 600,
    // 알약 끝에서 점 중심까지. 이만큼 옮겨야 점이 국가 좌표에 앉는다.
    inset: 10 + dot / 2,
  };
}

let measureCtx: CanvasRenderingContext2D | null = null;

/** 알약 폭. 글자는 캔버스로 잰다 — 화면과 같은 Pretendard 12px이다. */
function pillWidth(kind: PinKind, label: string): number {
  const m = pinMetrics(kind);
  measureCtx ??= document.createElement('canvas').getContext('2d');
  let text = label.length * 7;
  if (measureCtx) {
    measureCtx.font = `${m.weight} 12px Pretendard, sans-serif`;
    text = measureCtx.measureText(label).width;
  }
  return Math.ceil(10 + m.dot + 6 + text + 10);
}

function pillBox(kind: PinKind, [x, y]: [number, number], side: 'left' | 'right', label: string): Box {
  const m = pinMetrics(kind);
  const w = pillWidth(kind, label);
  const x0 = side === 'right' ? x - m.inset : x + m.inset - w;
  return [x0, y - m.height / 2, x0 + w, y + m.height / 2];
}

function overlaps(a: Box, b: Box): boolean {
  return (
    a[0] < b[2] + PIN_GAP_X &&
    b[0] < a[2] + PIN_GAP_X &&
    a[1] < b[3] + PIN_GAP_Y &&
    b[1] < a[3] + PIN_GAP_Y
  );
}

/**
 * 알약 자리 잡기. 지도 높이가 300px 남짓이라 KR·JP·CN이 50px 안에 몰린다 —
 * 그대로 두면 알약이 알약 위에 앉아 `KR · 출발`이 `JP`에 가려진다.
 * 우선순위대로 하나씩 놓으면서 이미 놓인 것과 겹치지 않는 첫 자리를 고른다.
 *
 *   전체 이름 먼저 쪽 → 반대쪽 → 국가 코드만 먼저 쪽 → 반대쪽 → 점만
 *
 * 도착국은 맨 먼저 놓이므로 늘 전체 이름을 받는다. 누를 수 있는 국가는 점만
 * 남아도 여전히 누를 수 있다.
 */
function placePins(
  pins: Pin[],
  points: ([number, number] | null)[],
  width: number,
  shown: (pin: Pin) => boolean,
): (Placement | null)[] {
  const placed: Box[] = [];
  const out: (Placement | null)[] = pins.map(() => null);
  const order = pins
    .map((_, i) => i)
    .filter((i) => points[i] && shown(pins[i]))
    .sort((a, b) => PRIORITY[pins[a].kind] - PRIORITY[pins[b].kind]);

  for (const i of order) {
    const pin = pins[i];
    const xy = points[i]!;
    const sides = pin.side === 'left' ? (['left', 'right'] as const) : (['right', 'left'] as const);
    const labels = pin.short === pin.label ? [pin.label] : [pin.label, pin.short];
    let placement: Placement = { side: pin.side, label: null };

    search: for (const label of labels) {
      for (const side of sides) {
        const box = pillBox(pin.kind, xy, side, label);
        if (box[0] < 0 || box[2] > width) continue;
        if (placed.some((b) => overlaps(b, box))) continue;
        placed.push(box);
        placement = { side, label };
        break search;
      }
    }
    if (placement.label === null) {
      const r = pinMetrics(pin.kind).dot / 2 + 5;
      placed.push([xy[0] - r, xy[1] - r, xy[0] + r, xy[1] + r]);
    }
    out[i] = placement;
  }
  return out;
}

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

/**
 * 도착국이 출발국의 동쪽인가. 경도가 ±180에서 감기므로 짧은 쪽으로 재서 본다 —
 * KR(129)에서 US(-118.2)는 서쪽으로 247도가 아니라 동쪽으로 113도다.
 */
function isEastward(origin: CountryInfo, dest: CountryInfo): boolean {
  let d = dest.lng - origin.lng;
  while (d > 180) d -= 360;
  while (d <= -180) d += 360;
  return d > 0;
}

/**
 * 국가 검색 판정. 코드(`VN`)·한국어명(`베트남`)·영문명(`Viet Nam`) 셋 다 본다.
 * 사용자가 무엇을 칠지 모른다 — 지도에 보이는 것은 코드뿐이지만 머리에 있는 것은
 * 한국어 이름이다. 빈 검색어는 전부 통과시킨다.
 */
function matchesCountry(c: CountryInfo, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === '') return true;
  return [c.code, c.nameKo, c.nameEn].some((s) => s.toLowerCase().includes(q));
}

// S5 Map.
export default function MapPage() {
  const done = useActionsDone();
  const ds = useDataset();

  // 지도 영역 안의 마커 픽셀 좌표와 영역 폭. DotGeo가 다시 그릴 때마다 갱신되므로
  // 창 크기를 바꿔도 마커가 점을 따라간다.
  const [points, setPoints] = useState<([number, number] | null)[]>([]);
  const [mapW, setMapW] = useState(0);
  // 지원 국가 마커를 탭했을 때 "도착국을 바꿀까요"를 묻는 상대. 모달이 아니다.
  const [ask, setAsk] = useState<CountryInfo | null>(null);
  // 국가 검색어. 마커만 거른다 — 지도와 항로는 그대로 둔다.
  // 검색으로 지형이 사라지면 어디를 보고 있는지 알 수 없다.
  const [query, setQuery] = useState('');
  // 시트는 프로필의 도착국 하나를 말한다.
  const focus = ds?.country;
  const origin = ds ? countryByCode(ds.profile.originCountry) : undefined;
  const countryLaws = ds && focus ? lawsOfCountry(ds, focus.code) : [];
  const rows = ds && focus ? sheetLaws(ds, focus.code, done) : [];
  const openCount = ds && focus ? openActionCountOfCountry(ds, focus.code, done) : 0;
  const risk = ds && focus ? countryRisk(ds, focus.code) : null;

  const pins: Pin[] = useMemo(() => {
    if (!ds) return [];
    const destCode = ds.profile.destinationCountry;
    const originCode = ds.profile.originCountry;
    const destRisk = focus ? countryRisk(ds, focus.code) : null;
    // 도착국이 아시아 밖이면 지도가 태평양까지 넓어져 축척이 작아진다. 지원 예정
    // 마커는 "왜 넷뿐인가"에 답하는 장치인데 그 답은 아시아 지도에서만 읽힌다.
    // 넓어진 지도에서는 접는다(§166).
    const dense = focus ? outsideArtboardBox([focus.lng, focus.lat]) : false;
    return countries
      .filter((c) => c.destination || c.code === originCode)
      .filter((c) => !dense || c.supported || c.code === originCode)
      .map((c): Pin => {
        const base = { country: c, short: c.code, risk: null, side: 'right' as const };
        if (c.code === originCode) {
          return {
            ...base,
            kind: 'origin',
            label: `${c.code} · 출발`,
            // 도착국이 동쪽이면 알약을 왼쪽으로 먼저 펴 본다. 항로가 나가는 쪽에
            // 그대로 두면 도착국 알약과 부딪친다(§166).
            side: focus && isEastward(c, focus) ? 'left' : 'right',
          };
        }
        if (!c.supported) return { ...base, kind: 'planned', label: `${c.code} · 지원 예정` };
        if (c.code === destCode) {
          return {
            ...base,
            kind: 'dest',
            label: destRisk ? `${c.code} · ${RISK_LABEL[destRisk]}` : c.code,
            risk: destRisk,
          };
        }
        return { ...base, kind: 'supported', label: c.code };
      });
  }, [ds, focus]);

  // DotGeo는 이 콜백을 ref에 담아 두고 매 렌더 갱신한다. 그래서 pins가 바뀌면
  // 다음 재생성 때 최신 목록으로 좌표를 뽑는다. pins가 바뀌는 유일한 계기는
  // 도착국 변경이고, 그때 DotGeo의 to도 같이 바뀌어 재생성이 걸린다.
  const handleProject = useCallback(
    (project: Projector, size: { w: number; h: number }) => {
      setPoints(pins.map((p) => project([p.country.lng, p.country.lat])));
      setMapW(size.w);
    },
    [pins],
  );

  // 검색은 자리 잡기 전에 거른다 — 숨긴 마커가 자리를 차지하면 보이는 마커가
  // 괜히 이름을 접는다. pins 배열 자체는 줄이지 않는다. 좌표는 DotGeo가
  // pins 순서대로 주므로 인덱스가 어긋나면 마커가 엉뚱한 곳에 붙는다.
  const placements = useMemo(
    () => placePins(pins, points, mapW, (p) => matchesCountry(p.country, query)),
    [pins, points, mapW, query],
  );

  function switchTo(country: CountryInfo) {
    if (ds) {
      saveProfile({
        ...ds.profile,
        destinationCountry: country.code,
        updatedAt: new Date().toISOString(),
      });
    }
    setAsk(null);
  }

  const sheet = (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 'var(--sheet-h)',
        zIndex: 4,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--r-sheet) var(--r-sheet) 0 0',
        background: 'var(--tds-bg-elevated)',
        borderTop: '1px solid var(--tds-line-subtle)',
        boxShadow: 'var(--shadow-sheet)',
      }}
    >
      {/* 드래그 핸들. 시각 요소로만 둔다 — 펼친 뒤의 상태가 명세에 없고,
          내용이 시트에 맞아 확장할 것이 없다. 그래서 vaul을 쓰지 않는다. */}
      <div aria-hidden="true" style={{ flex: 'none', display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
        <span
          style={{ width: 40, height: 4, borderRadius: 'var(--r-full)', background: 'var(--tds-bg-tertiary)' }}
        />
      </div>

      {/* 시트 아래쪽에 탭바가 겹쳐 앉는다. 마지막 줄이 그 뒤로 들어가지 않게
          탭바 높이만큼 비우고, 짧은 화면에서는 시트 안이 스크롤된다. */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '14px var(--pad) var(--pad-tabbar)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* 다른 지원 국가를 눌렀을 때만 뜬다. 누르자마자 보이도록 시트 맨 위에 둔다. */}
        {ask && (
          <div
            role="status"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '12px 14px',
              borderRadius: 'var(--r-l)',
              background: 'var(--risk-med-bg)',
              color: 'var(--risk-med-fg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Icon name="triangle-alert" size={20} />
              <span className="t-meta" style={{ flex: 1, minWidth: 0 }}>
                도착국을 {withRo(ask.nameKo)} 바꾸면 완료 표시가 초기화돼요
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button variant="ghost" size="s" onClick={() => setAsk(null)}>
                취소
              </Button>
              <Button size="s" onClick={() => switchTo(ask)}>
                바꾸기
              </Button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 className="t-h1" style={{ lineHeight: 1.3 }}>
              {focus?.nameKo ?? ''}
            </h1>
            {risk && <Badge tone={risk}>{RISK_LABEL[risk]}</Badge>}
          </div>
          <p className="t-meta tnum" style={{ color: 'var(--tds-fg-tertiary)' }}>
            규제 {countryLaws.length} · 미완 액션 {openCount}
          </p>
        </div>

        {rows.length > 0 ? (
          <Card padding="2px 16px" radius="var(--r-xl)">
            {rows.map((law, i) => {
              const badge = lawBadge(law, ds!.today);
              return (
                <Row
                  key={law.id}
                  href={`/laws/${law.id}`}
                  padding="12px 0"
                  gap={2}
                  divider={i < rows.length - 1}
                  trailing={
                    <Badge tone={badge.tone} tnum={badge.tnum}>
                      {badge.text}
                    </Badge>
                  }
                >
                  <span
                    style={{
                      font: '500 11px/1.4 var(--font)',
                      fontVariantNumeric: 'tabular-nums',
                      color: 'var(--tds-fg-quaternary)',
                    }}
                  >
                    {law.officialRef}
                  </span>
                  <span className="t-body-m one-line">{law.title}</span>
                </Row>
              );
            })}
          </Card>
        ) : (
          <p className="t-meta" style={{ color: 'var(--tds-fg-tertiary)' }}>
            대응이 필요한 법률이 없어요
          </p>
        )}

        <Link
          href="/laws"
          className="tap-y"
          style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span className="t-body-b" style={{ lineHeight: 1 }}>
            법률 <span className="tnum">{countryLaws.length}</span>건 모두 보기
          </span>
          <Icon name="chevron-right" size={18} stroke={2} />
        </Link>
      </div>
    </div>
  );

  return (
    <Screen
      // 시트가 스크롤 영역 아래쪽을 통째로 덮는다. 하단 여백은 시트 쪽에서 잡는다.
      scrollPadBottom="0px"
      footer={
        <>
          {sheet}
          {/* 시트가 바닥을 이미 덮으므로 탭바 뒤 보호 그라디언트는 끈다. */}
          <TabBar veil={false} />
        </>
      }
    >
      {/* 디자인 원본의 우상단 필터 아이콘은 뺐다 — 열 화면이 없다. 거르는 일은
          아래 검색이 한다. */}
      <TopBar left={<span className="t-appbar">지도</span>} />

      <div style={{ padding: '4px var(--pad) 0' }}>
        <SearchField value={query} onChange={setQuery} placeholder="국가 검색" ariaLabel="국가 검색" />
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: MAP_TOP, bottom: 'var(--sheet-h)' }}>
        <DotGeo
          mode="asia"
          dotColor="var(--geo-dot)"
          from={origin ? [origin.lng, origin.lat] : undefined}
          to={focus ? [focus.lng, focus.lat] : undefined}
          rightRoom={LABEL_ROOM}
          onProject={handleProject}
        />
        {pins.map((pin, i) => {
          const xy = points[i];
          const placement = placements[i];
          if (!xy || !placement) return null;
          return (
            <MapPin
              key={pin.country.code}
              pin={pin}
              xy={xy}
              placement={placement}
              onSelect={pin.kind === 'supported' ? () => setAsk(pin.country) : undefined}
            />
          );
        })}
      </div>
    </Screen>
  );
}

/** 마커 알약. 점의 중심이 국가 좌표에 오도록 알약을 옮긴다. 이름을 접으면 점만 남는다. */
function MapPin({
  pin,
  xy,
  placement,
  onSelect,
}: {
  pin: Pin;
  xy: [number, number];
  placement: Placement;
  onSelect?: () => void;
}) {
  const m = pinMetrics(pin.kind);
  const planned = pin.kind === 'planned';
  const dest = pin.kind === 'dest';
  const flip = placement.side === 'left';
  const compact = placement.label === null;

  const dotColor =
    pin.kind === 'origin'
      ? 'var(--tds-fg-primary)'
      : planned
        ? 'var(--tds-fg-quaternary)'
        : dest
          ? pin.risk
            ? `var(--pin-dot-${pin.risk})`
            : 'var(--tds-bg-primary)'
          : 'var(--tds-fg-tertiary)';

  const style: CSSProperties = {
    position: 'absolute',
    left: Math.round(xy[0]),
    top: Math.round(xy[1]),
    zIndex: dest ? 2 : 1,
    transform: compact
      ? 'translate(-50%, -50%)'
      : flip
        ? `translate(calc(-100% + ${m.inset}px), -50%)`
        : `translate(-${m.inset}px, -50%)`,
    display: 'flex',
    flexDirection: flip ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: compact ? m.dot + 10 : undefined,
    height: compact ? m.dot + 10 : m.height,
    padding: compact ? 0 : '0 10px',
    borderRadius: 'var(--r-full)',
    background: dest
      ? 'var(--tds-fg-primary)'
      : planned
        ? 'var(--tds-bg-secondary)'
        : 'var(--tds-bg-primary)',
    color: dest
      ? 'var(--tds-bg-primary)'
      : planned
        ? 'var(--tds-fg-tertiary)'
        : 'var(--tds-fg-secondary)',
    boxShadow: planned ? undefined : 'var(--shadow-2)',
    font: `${m.weight} 12px/1 var(--font)`,
    whiteSpace: 'nowrap',
  };

  const inner = (
    <>
      <span
        style={{ flex: 'none', width: m.dot, height: m.dot, borderRadius: 'var(--r-full)', background: dotColor }}
      />
      {placement.label}
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-label={`도착국을 ${withRo(pin.country.nameKo)} 바꾸기`}
        // 고를 수 있는 마커만 히트 영역을 44px로 넓힌다.
        className="tap"
        style={{ ...style, cursor: 'pointer' }}
      >
        {inner}
      </button>
    );
  }
  return (
    <div aria-label={compact ? pin.label : undefined} style={{ ...style, pointerEvents: 'none' }}>
      {inner}
    </div>
  );
}
