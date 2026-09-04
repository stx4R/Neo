import { actionsOfLaw, laws } from '@/lib/data';
import { countdown, daysUntil, type Countdown } from '@/lib/dday';
import type { Action, Law } from '@/types/neo';

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
export function mustDoNow(doneIds: readonly string[]): MustDo[] {
  const done = new Set(doneIds);
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

/** 아직 끝나지 않은 액션 수. */
export function openActionCount(doneIds: readonly string[]): number {
  const done = new Set(doneIds);
  return laws.flatMap(actionsOfLaw).filter((a) => !done.has(a.id)).length;
}
