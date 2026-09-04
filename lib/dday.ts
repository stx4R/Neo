import meta from '@/data/meta.json';
import { RISK_COLOR } from '@/types/neo';

/**
 * 기준 날짜. 목 데이터의 D-Day는 전부 이 값 기준으로 맞춰져 있다.
 * new Date()를 쓰면 D-Day가 디자인 산출물과 어긋난다.
 */
export const REFERENCE_DATE = meta.referenceDate;

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * ISO 시각에서 '한국 시각 기준 달력 날짜'(YYYY-MM-DD)를 뽑는다.
 *
 * toISOString()을 그냥 쓰면 안 된다 — referenceDate가 2026-09-03T08:12+09:00 이라
 * UTC로는 09-02가 되고 D-Day가 통째로 하루씩 밀린다.
 */
export function kstDay(iso: string): string {
  return new Date(new Date(iso).getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

/** 기준일의 달력 날짜. */
export const TODAY = kstDay(REFERENCE_DATE);

/** 기준일로부터 남은 일수. 음수면 기한이 지났다. */
export function daysUntil(date: string): number {
  const target = date.length > 10 ? kstDay(date) : date;
  return Math.round(
    (Date.parse(`${target}T00:00:00Z`) - Date.parse(`${TODAY}T00:00:00Z`)) / 86_400_000,
  );
}

export type Countdown =
  | { overdue: false; days: number; text: string; tone: string }
  | { overdue: true; days: number; text: string; tone: string };

/**
 * 마감까지의 카운트다운. 배지에 그대로 넣는다.
 *
 * 원본의 확정점은 D-14 = critical, D-45 = medium 둘뿐이다.
 * 그 사이를 3단으로 끊어 --risk-high 까지 쓴다.
 *
 *   기한 경과 · D-14 이하  →  critical
 *   D-15 ~ D-30           →  high
 *   D-31 이상             →  medium
 *
 * 초록(--risk-low)은 쓰지 않는다. 마감일 배지가 "안전"으로 읽히면 안 된다.
 * deadline이 없는 법률은 배지 자체를 그리지 않는다 — 호출부에서 거른다.
 */
export function countdown(deadline: string): Countdown {
  const days = daysUntil(deadline);
  if (days < 0) {
    return { overdue: true, days, text: '기한 경과', tone: RISK_COLOR.critical };
  }
  const tone =
    days <= 14 ? RISK_COLOR.critical : days <= 30 ? RISK_COLOR.high : RISK_COLOR.medium;
  return { overdue: false, days, text: `D-${days}`, tone };
}

/** '2026.01.23' */
export function formatDate(iso: string): string {
  return kstDay(iso).replace(/-/g, '.');
}

/** '01.23' */
export function formatMonthDay(iso: string): string {
  return kstDay(iso).slice(5).replace('-', '.');
}

/** '09.03 08:12' — 상단바의 마지막 동기화 시각. */
export function formatSyncTime(iso: string): string {
  const kst = new Date(new Date(iso).getTime() + KST_OFFSET_MS).toISOString();
  return `${kst.slice(5, 10).replace('-', '.')} ${kst.slice(11, 16)}`;
}
