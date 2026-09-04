import { actionsOfLaw, laws, priorities, productsOfLaw } from '@/lib/data';
import { countdown, daysUntil, formatDate, type Countdown } from '@/lib/dday';
import {
  RISK_COLOR,
  RISK_LABEL,
  STATUS_COLOR,
  type Action,
  type Law,
  type RiskLevel,
} from '@/types/neo';

/**
 * 화면에 박힌 숫자는 전부 여기서 나온다.
 * '대응 필요 3건' 같은 값을 문자열로 박으면 액션을 하나 체크하는 순간 거짓말이 된다.
 */

export interface MustDo {
  law: Law;
  action: Action;
  countdown: Countdown;
}

/**
 * MUST DO NOW — 마감일이 있는 법률마다 아직 끝나지 않은 첫 액션 하나씩.
 * 순서는 laws.json 순서를 따르고, 배지는 액션의 dueDate가 아니라 법률의 deadline을 쓴다.
 * 액션이 전부 끝난 법률은 목록에서 빠진다.
 */
export function mustDoNow(done: ReadonlySet<string>): MustDo[] {
  return laws
    .filter((law) => law.deadline !== null)
    .map((law) => {
      const action = actionsOfLaw(law).find((a) => !done.has(a.id));
      return action ? { law, action, countdown: countdown(law.deadline!) } : null;
    })
    .filter((m): m is MustDo => m !== null);
}

/**
 * THIS WEEK — 마감이 아직 남아 있는 법률. 기한이 지난 것은 빠진다.
 * 순서는 laws.json 순서.
 */
export function thisWeek(): Law[] {
  return laws.filter((law) => law.deadline !== null && daysUntil(law.deadline) >= 0);
}

/** 보류된 법률. S1 상단 상태 스트립에 쓴다. */
export function heldLaws(): Law[] {
  return laws.filter((law) => law.status === 'hold');
}

/** 한 법률에서 아직 끝나지 않은 액션. */
export function openActionsOfLaw(law: Law, done: ReadonlySet<string>): Action[] {
  return actionsOfLaw(law).filter((a) => !done.has(a.id));
}

/** 전체에서 아직 끝나지 않은 액션 수. */
export function openActionCount(done: ReadonlySet<string>): number {
  return laws.flatMap(actionsOfLaw).filter((a) => !done.has(a.id)).length;
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
export function listBadge(law: Law): BadgeSpec | null {
  if (law.status === 'hold') {
    return { tone: STATUS_COLOR.hold, text: '보류', tnum: false };
  }
  if (law.deadline === null) return null;
  const c = countdown(law.deadline);
  return { tone: c.tone, text: c.text, tnum: !c.overdue };
}

/**
 * S3 헤더 배지. 색면은 언제나 위험도이고, 상태는 글자에 꼬리로 붙는다.
 * "HIGH · D-45" / "MEDIUM · 보류" / "LOW"
 */
export function headerBadge(law: Law): BadgeSpec {
  const tone = RISK_COLOR[law.riskLevel];
  const risk = RISK_LABEL[law.riskLevel];
  if (law.status === 'hold') return { tone, text: `${risk} · 보류`, tnum: false };
  if (law.deadline === null) return { tone, text: risk, tnum: false };
  const c = countdown(law.deadline);
  return { tone, text: `${risk} · ${c.text}`, tnum: !c.overdue };
}

// ── S2 필터·정렬 ───────────────────────────────────────────────

export const FILTER_PRESETS = ['내 우선순위', '전체', 'VN', 'HIGH+', '시행 임박'] as const;
export type FilterPreset = (typeof FILTER_PRESETS)[number];

export const SORT_OPTIONS = [
  { key: 'date', label: '시행일순' },
  { key: 'risk', label: '위험도순' },
] as const;
export type SortKey = (typeof SORT_OPTIONS)[number]['key'];

const RISK_RANK: Record<RiskLevel, number> = { critical: 3, high: 2, medium: 1, low: 0 };

function matchesPreset(law: Law, preset: FilterPreset): boolean {
  switch (preset) {
    case '내 우선순위':
      return priorities.some((p) => p.category === law.category);
    case '전체':
      return true;
    case 'VN':
      return law.country === 'VN';
    case 'HIGH+':
      return law.riskLevel === 'critical' || law.riskLevel === 'high';
    case '시행 임박':
      // 기한이 지난 것도 포함한다. 규제 대응 앱에서 경과한 마감을
      // '임박' 필터 뒤에 숨기면 가장 급한 걸 놓친다.
      return law.deadline !== null && daysUntil(law.deadline) <= 30;
  }
}

function matchesQuery(law: Law, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === '') return true;
  // 액션 문구까지 본다. 이 앱은 법률이 아니라 할 일을 파는 앱이라,
  // 해야 할 작업의 말로 법률을 찾는 게 자연스럽다.
  const haystack = [
    law.title,
    law.officialRef,
    ...productsOfLaw(law).map((p) => p.name),
    ...actionsOfLaw(law).map((a) => a.title),
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

export function visibleLaws(preset: FilterPreset, sort: SortKey, query: string): Law[] {
  return laws
    .filter((law) => matchesPreset(law, preset) && matchesQuery(law, query))
    .sort((a, b) => compareLaws(a, b, sort));
}
