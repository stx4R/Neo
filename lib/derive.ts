import { priorities, productsMatching } from '@/lib/data';
import type { Dataset } from '@/lib/dataset';
import {
  countdown,
  daysUntil,
  formatDate,
  formatMonthDay,
  kstDay,
  type Countdown,
} from '@/lib/dday';
import {
  RISK_COLOR,
  RISK_LABEL,
  STATUS_COLOR,
  type Action,
  type Category,
  type Law,
  type Notification,
  type Product,
  type RiskLevel,
} from '@/types/neo';

/**
 * 화면에 박힌 숫자는 전부 여기서 나온다.
 * '대응 필요 3건' 같은 값을 문자열로 박으면 액션을 하나 체크하는 순간 거짓말이 된다.
 *
 * 조합에 매인 함수는 Dataset을 첫 인자로 받는다. 모듈 레벨 laws를 보던 시절에는
 * 화면이 프로필을 따라갈 수 없었다.
 */

/**
 * 이 조합 데이터를 마지막으로 확인한 날.
 *
 * 상단바의 시각 자리다. 예전에는 REFERENCE_DATE를 "마지막 동기화"로 찍었는데
 * 동기화하는 서버가 없으므로 그건 지어낸 시각이었다. 실제로 말할 수 있는 것은
 * "우리가 이 출처들을 언제 열어 봤는가"뿐이다.
 */
export function dataAsOf(ds: Dataset): string | null {
  const days = ds.laws.map((l) => l.source.lastVerified).sort();
  return days.length > 0 ? days[days.length - 1] : null;
}

/**
 * 이 조합에서 이 법령에 걸린 액션. `law.actionIds` 순서를 지킨다.
 *
 * 전역 목록이 아니라 `ds.actions`에서 찾는다. 공용 법령은 액션이 품목별로 갈리는데
 * (`Action.itemCategories`) 전역에서 찾으면 화장품 사용자에게 식품 액션이 섞인다.
 * `ds.actions`는 이미 품목으로 걸러져 있다.
 */
export function actionsOfLaw(ds: Dataset, law: Law): Action[] {
  const byId = new Map(ds.actions.map((a) => [a.id, a]));
  return law.actionIds
    .map((id) => byId.get(id))
    .filter((a): a is Action => a !== undefined);
}

/** 이 법령의 영향 제품. 사용자의 제품 목록에서 HS 앞자리로 고른다. */
export function productsOfLaw(ds: Dataset, law: Law): Product[] {
  return productsMatching(law, ds.products);
}

export interface MustDo {
  law: Law;
  action: Action;
  countdown: Countdown;
}

/**
 * 액션 하나에 붙는 배지. **실재하는 날짜에서만 나온다.**
 *
 *   1. 법령에 명시된 기한(law.deadline)이 있으면 거기까지 카운트다운
 *   2. 없는데 법령이 이미 시행 중이면 `기한 경과` — 의무가 이미 살아 있는데 안 했다
 *   3. 아직 시행 전이면 시행일까지 카운트다운
 *   4. 보류 법령이면 배지 없음 — 언제까지 해야 하는지 아무도 모른다
 *
 * 아트보드의 D-45·D-14는 목 데이터에 맞춰 그린 허구값이라 쓰지 않는다.
 */
export function actionBadge(law: Law, today: string): Countdown | null {
  if (law.status === 'hold') return null;
  if (law.deadline) return countdown(law.deadline, today);
  return sinceEffective(law, today);
}

/**
 * 기한이 없는 법령의 배지.
 *
 * 시행일이 지났다면 `기한 경과`가 아니라 **`미이행`**이다. 놓친 날짜가 있는 게
 * 아니라 이미 지켜야 하는 의무를 아직 안 한 것이다. CIRCULAR 06/2011처럼
 * 애초에 기한 개념이 없는 상시 의무에 "기한 경과"를 붙이면 틀린 말이 된다.
 * 색은 그대로 critical이다 — 지금 위반 상태라는 사실은 달라지지 않는다.
 */
function sinceEffective(law: Law, today: string): Countdown {
  const c = countdown(law.effectiveDate, today);
  return c.overdue ? { ...c, text: '미이행' } : c;
}

/**
 * MUST DO NOW — 아직 끝나지 않은 액션이 있는 법률마다 첫 액션 하나씩.
 *
 * 예전에는 `deadline`이 있는 법률만 골랐는데, 허구 deadline을 폐기하고 나니
 * 그 기준으로는 목록이 거의 비었다. 기준은 "마감이 적혀 있는가"가 아니라
 * "아직 안 한 일이 있는가"다.
 *
 * 보류 법령은 빠진다 — 효력이 정지된 법의 액션은 지금 할 일이 아니다.
 * 급한 순으로 세운다: 기한 경과가 먼저, 그다음 남은 날짜가 적은 순.
 */
export function mustDoNow(ds: Dataset, done: ReadonlySet<string>): MustDo[] {
  return ds.laws
    .filter((law) => law.status !== 'hold')
    .map((law) => {
      const action = actionsOfLaw(ds, law).find((a) => !done.has(a.id));
      if (!action) return null;
      return { law, action, countdown: actionBadge(law, ds.today) };
    })
    .filter((m): m is MustDo => m !== null)
    .sort((a, b) => (a.countdown?.days ?? Infinity) - (b.countdown?.days ?? Infinity));
}

/** THIS WEEK 창. 앞뒤 7일 — 곧 닥치는 것과 방금 지나간 것 둘 다 봐야 한다. */
const WEEK = 7;

/**
 * THIS WEEK — 이번 주에 실제로 무슨 일이 있는 법률.
 *
 * 기준 날짜는 법령의 기한이고, 없으면 시행일이다. 앞뒤 7일 안에 들면 여기 선다.
 * 해당하는 법률이 없으면 **섹션 자체를 그리지 않는다.** 아무 일도 없는 주에
 * "이번 주"라는 라벨만 남기지 않는다.
 */
export function thisWeek(ds: Dataset): Law[] {
  return ds.laws.filter((law) => {
    const at = law.deadline ?? law.effectiveDate;
    const d = daysUntil(at, ds.today);
    return d >= -WEEK && d <= WEEK;
  });
}

/** 보류된 법률. S1 상단 상태 스트립에 쓴다. */
export function heldLaws(ds: Dataset): Law[] {
  return ds.laws.filter((law) => law.status === 'hold');
}

/** 한 법률에서 아직 끝나지 않은 액션. */
export function openActionsOfLaw(
  ds: Dataset,
  law: Law,
  done: ReadonlySet<string>,
): Action[] {
  return actionsOfLaw(ds, law).filter((a) => !done.has(a.id));
}

/** 전체에서 아직 끝나지 않은 액션 수. */
export function openActionCount(ds: Dataset, done: ReadonlySet<string>): number {
  return ds.actions.filter((a) => !done.has(a.id)).length;
}

/**
 * 사용자가 이 법률에 대해 할 일이 없는 상태.
 * 시행 중이지만 마감도 없고 액션도 없다 — DECREE 15/2018 이 여기 해당한다.
 * 마커 색과 목록 메타의 첫 칸이 이 판단 하나에 매인다.
 */
export function isDormant(law: Law): boolean {
  return law.status === 'active' && law.deadline === null && law.actionIds.length === 0;
}

/** 목록 행의 한자 마커 색. 대응할 게 없으면 힘을 뺀다. */
export function markColor(law: Law): string {
  return isDormant(law) ? 'var(--text-3)' : STATUS_COLOR[law.status];
}

/** 목록 메타의 첫 칸. "2026.01.23 시행" / "2026.04.06 보류" / "현행 유효" */
export function statusLine(law: Law): string {
  if (law.status === 'hold') {
    return law.heldAt ? `${formatDate(law.heldAt)} 보류` : '보류';
  }
  if (isDormant(law)) return '현행 유효';
  return `${formatDate(law.effectiveDate)} 시행`;
}

export interface BadgeSpec {
  tone: string;
  text: string;
  tnum: boolean;
}

/**
 * S2 목록 행 우측 배지.
 * 보류는 D-Day를 계산하지 않고, 마감이 없으면 배지 자체를 그리지 않는다.
 */
export function listBadge(law: Law, today: string): BadgeSpec | null {
  if (law.status === 'hold') {
    return { tone: STATUS_COLOR.hold, text: '보류', tnum: false };
  }
  // 대응할 것이 없는 법률에는 배지를 달지 않는다.
  if (isDormant(law)) return null;
  const c = law.deadline ? countdown(law.deadline, today) : sinceEffective(law, today);
  return { tone: c.tone, text: c.text, tnum: !c.overdue };
}

/**
 * S3 헤더 배지. 색면은 언제나 위험도이고, 상태는 글자에 꼬리로 붙는다.
 * "HIGH · D-45" / "MEDIUM · 보류" / "LOW"
 */
export function headerBadge(law: Law, today: string): BadgeSpec {
  const tone = RISK_COLOR[law.riskLevel];
  const risk = RISK_LABEL[law.riskLevel];
  if (law.status === 'hold') return { tone, text: `${risk} · 보류`, tnum: false };
  if (isDormant(law)) return { tone, text: risk, tnum: false };
  const c = law.deadline ? countdown(law.deadline, today) : sinceEffective(law, today);
  return { tone, text: `${risk} · ${c.text}`, tnum: !c.overdue };
}

// ── S2 필터·정렬 ───────────────────────────────────────────────

// 국가 칩은 없앴다 — 도착국은 프로필로 고정이라 거를 것이 없다.
export const FILTER_PRESETS = ['내 우선순위', '전체', 'HIGH+', '시행 임박'] as const;
export type FilterPreset = (typeof FILTER_PRESETS)[number];

export const SORT_OPTIONS = [
  { key: 'date', label: '시행일순' },
  { key: 'risk', label: '위험도순' },
] as const;
export type SortKey = (typeof SORT_OPTIONS)[number]['key'];

const RISK_RANK: Record<RiskLevel, number> = { critical: 3, high: 2, medium: 1, low: 0 };

/** 묶음의 최대 위험도. 비어 있으면 null. S4 타일과 S5 국가가 같이 쓴다. */
function maxRisk(group: Law[]): RiskLevel | null {
  return group.length
    ? group.reduce((a, b) => (RISK_RANK[a.riskLevel] >= RISK_RANK[b.riskLevel] ? a : b)).riskLevel
    : null;
}

function matchesPreset(law: Law, preset: FilterPreset, today: string): boolean {
  switch (preset) {
    case '내 우선순위':
      return priorities.some((p) => p.category === law.category);
    case '전체':
      return true;

    case 'HIGH+':
      return law.riskLevel === 'critical' || law.riskLevel === 'high';
    case '시행 임박':
      // 기한이 지난 것도 포함한다. 규제 대응 앱에서 경과한 마감을
      // '임박' 필터 뒤에 숨기면 가장 급한 걸 놓친다.
      return !isDormant(law) && daysUntil(law.deadline ?? law.effectiveDate, today) <= 30;
  }
}

function matchesQuery(ds: Dataset, law: Law, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === '') return true;
  // 액션 문구까지 본다. 이 앱은 법률이 아니라 할 일을 파는 앱이라,
  // 해야 할 작업의 말로 법률을 찾는 게 자연스럽다.
  const haystack = [
    law.title,
    law.officialRef,
    ...productsOfLaw(ds, law).map((p) => p.name),
    ...actionsOfLaw(ds, law).map((a) => a.title),
  ];
  return haystack.some((s) => s.toLowerCase().includes(q));
}

/** 정렬 순서는 아트보드에 없다. 목업의 행 순서는 규칙이 아니므로 여기서 정의한다. */
function compareLaws(a: Law, b: Law, sort: SortKey): number {
  if (sort === 'date') {
    return b.effectiveDate.localeCompare(a.effectiveDate); // 최신 시행 먼저
  }
  const rank = RISK_RANK[b.riskLevel] - RISK_RANK[a.riskLevel];
  if (rank !== 0) return rank;
  // 동률이면 마감이 가까운 순. 마감 없는 것은 뒤로.
  if (a.deadline === null && b.deadline === null) return 0;
  if (a.deadline === null) return 1;
  if (b.deadline === null) return -1;
  return a.deadline.localeCompare(b.deadline);
}

export function visibleLaws(
  ds: Dataset,
  preset: FilterPreset,
  sort: SortKey,
  query: string,
): Law[] {
  return ds.laws
    .filter((law) => matchesPreset(law, preset, ds.today) && matchesQuery(ds, law, query))
    .sort((a, b) => compareLaws(a, b, sort));
}

// ── S4 Company ─────────────────────────────────────────────────

/** 우선순위 타일 한 장의 수치. 해당 category 법률이 없으면 risk는 null이다. */
export interface PriorityStat {
  lawCount: number;
  openCount: number;
  risk: RiskLevel | null;
}

export function priorityStat(
  ds: Dataset,
  category: Category,
  done: ReadonlySet<string>,
): PriorityStat {
  const matched = ds.laws.filter((law) => law.category === category);
  return {
    lawCount: matched.length,
    openCount: matched.reduce(
      (sum, law) => sum + openActionsOfLaw(ds, law, done).length,
      0,
    ),
    // 해당 법률 중 가장 높은 위험도. 라벨과 상단 4px 바가 같이 이 값을 쓴다.
    risk: maxRisk(matched),
  };
}

/** 이 제품에 걸리는 법률 수. 판정은 HS 앞자리다. */
export function lawCountForProduct(ds: Dataset, product: Product): number {
  const digits = product.hsCode.replace(/\D/g, '');
  return ds.laws.filter((law) => law.hsPrefixes.some((x) => digits.startsWith(x))).length;
}

/** 중복을 걷어낸 HS 코드. 사용자의 제품 순서를 지킨다. */
export function uniqueHsCodes(ds: Dataset): string[] {
  return [...new Set(ds.products.map((p) => p.hsCode))];
}

// ── S5 Map ─────────────────────────────────────────────────────

/** 한 국가의 법률. 시트가 국가 단위로 말하므로 여기서 거른다. */
export function lawsOfCountry(ds: Dataset, code: string): Law[] {
  return ds.laws.filter((law) => law.country === code);
}

/**
 * 국가 위험도. 그 국가 법률의 최대 위험도다 — S4 우선순위 타일과 같은 규칙.
 * VN은 DECREE 110/2026이 critical이라 CRITICAL이 된다.
 * 아트보드의 HIGH는 목 데이터보다 먼저 그려진 값이라 쓰지 않는다.
 * 시트 H1 옆 배지와 지도 위 VN 마커 라벨이 같이 이 값을 본다.
 */
export function countryRisk(ds: Dataset, code: string): RiskLevel | null {
  return maxRisk(lawsOfCountry(ds, code));
}

/** 시트에 세우는 행 수. 아트보드 실측. */
export const SHEET_ROWS = 3;

/**
 * S5 시트의 법률 행 — 미완 액션이 있는 법률을 마감 임박순으로 상위 3건.
 * 액션이 없는 보류(46)·휴면(15/2018)은 여기 들어오지 않는다. 그건 아래 링크가 받는다.
 * 액션을 전부 체크하면 0건이 되고, 그때는 행 대신 안내 한 줄만 남는다.
 */
export function sheetLaws(ds: Dataset, code: string, done: ReadonlySet<string>): Law[] {
  return lawsOfCountry(ds, code)
    .filter((law) => openActionsOfLaw(ds, law, done).length > 0)
    .sort((a, b) => {
      // 마감 없는 법률은 뒤로. 지금 데이터엔 없지만 순서가 임의가 되면 안 된다.
      if (a.deadline === null || b.deadline === null) {
        return Number(a.deadline === null) - Number(b.deadline === null);
      }
      return a.deadline.localeCompare(b.deadline);
    })
    .slice(0, SHEET_ROWS);
}

/** 한 국가에서 아직 끝나지 않은 액션 수. */
export function openActionCountOfCountry(
  ds: Dataset,
  code: string,
  done: ReadonlySet<string>,
): number {
  return lawsOfCountry(ds, code).reduce(
    (sum, law) => sum + openActionsOfLaw(ds, law, done).length,
    0,
  );
}

// ── S6 Notifications ───────────────────────────────────────────

export type NotificationGroup = 'TODAY' | 'THIS WEEK' | 'EARLIER';

/** 오늘과의 달력 일수 차. 경과 시간이 아니라 날짜 차다. */
function daysAgo(at: string, today: string): number {
  return -daysUntil(at, today);
}

/**
 * 시간 라벨. 5일까지는 일로, 그 뒤는 날짜로 적는다.
 *
 * 예전에는 24시간 미만을 "N시간 전"으로 적었는데, 파생 알림의 시각은 날짜뿐이라
 * 시각을 지어내야 그 문구가 나온다. 없는 정밀도를 만들지 않는다.
 */
export function notificationTime(at: string, today: string): string {
  const days = daysAgo(at, today);
  if (days <= 0) return '오늘';
  if (days <= 5) return `${days}일 전`;
  return formatMonthDay(at);
}

/** `new` 알림으로 볼 기간. 데이터셋에 들어온 지 이만큼 안 된 법령. */
const NEW_WINDOW_DAYS = 30;
/** `deadline` 알림을 띄우는 지점. */
const DEADLINE_MARKS = [7, 1] as const;

/**
 * 알림을 법령 데이터에서 만든다.
 *
 * 손으로 쓴 notifications.json을 버렸다. 고정 타임스탬프 6건이라 기준일이
 * 오늘로 바뀌는 순간 전부 EARLIER로 몰리고, 조합을 바꿔도 베트남 식품 얘기만 나왔다.
 *
 * | 타입 | 생성 조건 |
 * |---|---|
 * | deadline | 기한까지 D-7 / D-1 도달, 또는 기한 경과 |
 * | status   | statusChangedAt이 있는 법령 |
 * | new      | addedAt이 최근 30일 이내인 법령 |
 * | done     | 사용자가 완료한 액션 (localStorage에서 파생) |
 *
 * 파생 결과가 0건이면 S6는 빈 상태를 보여준다. 억지로 채우지 않는다.
 *
 * id는 내용에서 결정론적으로 만든다 — `neo.notifications.read`가 그 id를 담으므로
 * 렌더마다 달라지면 읽음 표시가 유지되지 않는다.
 */
export function derivedNotifications(
  ds: Dataset,
  done: ReadonlySet<string>,
): Notification[] {
  const out: Notification[] = [];

  for (const law of ds.laws) {
    // 기한 알림 — 실재하는 기한이 있을 때만. 없는 마감을 알리지 않는다.
    if (law.deadline) {
      const left = daysUntil(law.deadline, ds.today);
      if (left < 0) {
        out.push({
          id: `n-deadline-over-${law.id}`,
          type: 'deadline',
          lawId: law.id,
          title: `${law.officialRef} 기한 경과`,
          body: `${formatDate(law.deadline)}까지였습니다`,
          at: law.deadline,
        });
      } else {
        // D-7·D-1을 지나온 시점을 알림 시각으로 삼는다.
        for (const mark of DEADLINE_MARKS) {
          if (left > mark) continue;
          const at = shiftDays(law.deadline, -mark);
          out.push({
            id: `n-deadline-${mark}-${law.id}`,
            type: 'deadline',
            lawId: law.id,
            title: `${law.officialRef} D-${mark}`,
            body: `${formatDate(law.deadline)} 기한`,
            at,
          });
          break;
        }
      }
    }

    // 상태 변경 알림
    if (law.statusChangedAt) {
      const label = law.status === 'hold' ? '시행 보류' : '상태 변경';
      out.push({
        id: `n-status-${law.id}`,
        type: 'status',
        lawId: law.id,
        title: `${law.officialRef} ${label}`,
        body: law.transitionNote ?? law.title,
        at: law.statusChangedAt,
      });
    }

    // 신규 등록 알림 — 법이 새로 생긴 것이 아니라 목록에 새로 들어왔다는 뜻이다.
    // 그래서 제목이 법령명이고, 언제 들어왔는지를 곁말로 적는다.
    if (daysAgo(law.addedAt, ds.today) <= NEW_WINDOW_DAYS) {
      out.push({
        id: `n-new-${law.id}`,
        type: 'new',
        lawId: law.id,
        title: law.title,
        body: `${law.officialRef} · ${formatDate(law.addedAt)} 추가`,
        at: law.addedAt,
      });
    }
  }

  // 완료 알림 — 사용자가 체크한 액션. 완료 시각을 저장하지 않으므로
  // 시각은 오늘로 둔다. 없는 시각을 지어내지 않고 '오늘'로만 말한다.
  for (const law of ds.laws) {
    for (const action of actionsOfLaw(ds, law)) {
      if (!done.has(action.id)) continue;
      out.push({
        id: `n-done-${action.id}`,
        type: 'done',
        lawId: law.id,
        title: `${action.title} 완료`,
        body: law.officialRef,
        at: ds.today,
      });
    }
  }

  // 최근 순.
  return out.sort((a, b) => b.at.localeCompare(a.at));
}

/** 날짜에 일수를 더한다. 알림 시각을 기한에서 역산할 때 쓴다. */
function shiftDays(day: string, delta: number): string {
  const base = Date.parse(`${kstDay(day)}T00:00:00Z`) + delta * 86_400_000;
  return new Date(base).toISOString().slice(0, 10);
}

/** 알림을 TODAY / THIS WEEK / EARLIER 로 묶는다. 빈 그룹은 내보내지 않는다. */
export function groupedNotifications(
  items: readonly Notification[],
  today: string,
): { group: NotificationGroup; items: Notification[] }[] {
  const order: NotificationGroup[] = ['TODAY', 'THIS WEEK', 'EARLIER'];
  const of = (at: string): NotificationGroup => {
    const days = daysAgo(at, today);
    if (days <= 0) return 'TODAY';
    if (days <= 5) return 'THIS WEEK';
    return 'EARLIER';
  };
  return order
    .map((group) => ({ group, items: items.filter((n) => of(n.at) === group) }))
    .filter(({ items }) => items.length > 0);
}
