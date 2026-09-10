import meta from '@/data/meta.json';
import { RISK_COLOR } from '@/types/neo';

/**
 * 날짜 기준.
 *
 * `data/meta.json`의 `referenceDate`는 `"today"` 또는 ISO 문자열 둘 중 하나다.
 * 기본값은 `"today"` — 실제로 쓰는 웹이므로 오늘 기준이어야 한다.
 * ISO로 고정하는 경로는 남겨 둔다. 디자인 대조·스크린샷 재현에 필요하다.
 *
 * ★ 날짜 파생값을 모듈 상수로 만들지 않는다. 정적 배포라 SSR 시점이 곧 빌드 시점이고,
 *   `TODAY`를 모듈에서 굳히면 배포한 날짜가 영원히 오늘이 된다. 게다가 서버가 계산한
 *   값과 클라이언트가 계산한 값이 달라 hydration이 깨진다.
 *   그래서 `resolveToday()`는 **클라이언트 렌더에서만** 불린다 — Dataset이 들고 다닌다.
 */

const REFERENCE = meta.referenceDate as string;

/** 기준일을 ISO로 고정했는가. 고정했다면 그 값을, 아니면 null. */
export const PINNED: string | null = REFERENCE === 'today' ? null : REFERENCE;

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * ISO 시각에서 '한국 시각 기준 달력 날짜'(YYYY-MM-DD)를 뽑는다.
 *
 * toISOString()을 그냥 쓰면 안 된다 — 2026-09-03T08:12+09:00 같은 값은
 * UTC로는 09-02가 되고 D-Day가 통째로 하루씩 밀린다.
 */
export function kstDay(iso: string): string {
  return new Date(new Date(iso).getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

/**
 * 오늘. 기준일이 고정돼 있으면 그 날, 아니면 진짜 오늘이다.
 * **클라이언트에서만 부른다.** 서버에서 부르면 빌드 날짜가 굳는다.
 */
export function resolveToday(): string {
  return kstDay(PINNED ?? new Date().toISOString());
}

/** 기준일로부터 남은 일수. 음수면 기한이 지났다. */
export function daysUntil(date: string, today: string): number {
  const target = date.length > 10 ? kstDay(date) : date;
  return Math.round(
    (Date.parse(`${target}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000,
  );
}

export type Countdown =
  | { overdue: false; days: number; text: string; tone: string }
  | { overdue: true; days: number; text: string; tone: string };

/**
 * 마감까지의 카운트다운. 배지에 그대로 넣는다.
 *
 *   기한 경과 · D-14 이하  →  critical
 *   D-15 ~ D-30           →  high
 *   D-31 이상             →  medium
 *
 * 초록(--risk-low)은 쓰지 않는다. 마감일 배지가 "안전"으로 읽히면 안 된다.
 * 기한이 없는 법률은 배지 자체를 그리지 않는다 — 호출부에서 거른다.
 */
export function countdown(deadline: string, today: string): Countdown {
  const days = daysUntil(deadline, today);
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
