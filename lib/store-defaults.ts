/**
 * localStorage에 아무것도 없을 때의 초기 상태.
 *
 * 알림 6건 중 3건은 이미 읽은 것으로 시작한다 — S6 원본에서 n-04·n-05·n-06이
 * opacity .5 에 시안 점이 없고, 헤더가 "읽지 않음 3"으로 적혀 있다.
 * 이 값이 없으면 첫 실행에서 배지가 6으로 뜨고 디자인과 어긋난다.
 */
export const INITIAL_READ_NOTIFICATIONS: readonly string[] = ['n-04', 'n-05', 'n-06'];

/** 완료된 액션. 처음에는 없다 — 미완 9건이 디자인 기준이다. */
export const INITIAL_DONE_ACTIONS: readonly string[] = [];
