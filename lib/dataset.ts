'use client';

import { useMemo } from 'react';
import { categoryById, countryByCode, lawSetOf } from '@/lib/data';
import { resolveToday } from '@/lib/dday';
import { useProfile } from '@/lib/useProfile';
import type {
  Action,
  CountryInfo,
  ItemCategory,
  Law,
  Product,
  Profile,
} from '@/types/neo';

/**
 * 프로필이 가리키는 조합 하나를 펼친 것. 화면은 전부 이걸 보고 그린다.
 *
 * 모듈 레벨에 "현재 데이터셋"을 두지 않는다 — 전역 가변 상태를 React가 읽으면
 * 화면마다 다른 시점의 값을 볼 수 있다. 파생 함수에 인자로 넘긴다.
 */
export interface Dataset {
  profile: Profile;
  /**
   * 오늘(YYYY-MM-DD, 한국 시각 기준).
   *
   * 날짜 파생값이 전부 이 값 하나에서 나온다. Dataset이 들고 다니는 이유는
   * **클라이언트 렌더에서만 계산되기 때문**이다 — 이 객체는 프로필이 있어야
   * 만들어지고, 프로필은 hydration 이후에야 읽힌다. 서버에서 계산하면
   * 정적 배포 특성상 빌드 날짜가 굳고 hydration도 깨진다.
   */
  today: string;
  country: CountryInfo | undefined;
  category: ItemCategory | undefined;
  /** 출발국 필터를 이미 통과한 법령. */
  laws: Law[];
  actions: Action[];
  /** 사용자의 제품. 품목 기본 세트를 복사한 뒤 편집한 결과다. */
  products: Product[];
  /**
   * originScope 때문에 목록에서 빠진 법령 수.
   * 0이 아니면 S2 하단에 한 줄로 알린다 — 출발국을 바꿨는데
   * 아무것도 안 바뀐 척하지 않는다. 반대로 바뀐 척도 하지 않는다.
   */
  hiddenByOrigin: number;
  /** 이 조합에 법령 데이터가 아예 없는가. 빈 상태(S9 EMPTY)의 조건이다. */
  empty: boolean;
}

export function buildDataset(profile: Profile): Dataset {
  const set = lawSetOf(profile.destinationCountry, profile.itemCategory);

  // originScope가 있으면 그 출발국일 때만 노출한다. 없으면 출발국과 무관하다.
  const laws = set.laws.filter(
    (law) => !law.originScope || law.originScope.includes(profile.originCountry),
  );
  const visible = new Set(laws.map((l) => l.id));

  return {
    profile,
    today: resolveToday(),
    country: countryByCode(profile.destinationCountry),
    category: categoryById(profile.itemCategory),
    laws,
    actions: set.actions.filter((a) => visible.has(a.lawId)),
    products: profile.products,
    hiddenByOrigin: set.laws.length - laws.length,
    empty: set.laws.length === 0,
  };
}

/**
 * 화면용 데이터셋.
 *
 * `null`은 "아직 모른다"는 뜻이다 — 프로필은 localStorage에 있고,
 * `useSyncExternalStore`는 hydration 렌더에서 서버 스냅샷(= 프로필 없음)을 쓴다.
 * 그 한 프레임 동안 화면은 스켈레톤을 그린다. 없는 데이터를 0으로 채우지 않는다.
 */
export function useDataset(): Dataset | null {
  const profile = useProfile();
  return useMemo(() => (profile ? buildDataset(profile) : null), [profile]);
}
