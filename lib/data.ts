import categoriesJson from '@/data/categories.json';
import companyJson from '@/data/company.json';
import countriesJson from '@/data/countries.json';
import idCosmetics from '@/data/laws/ID-cosmetics.json';
import idElectronics from '@/data/laws/ID-electronics.json';
import idFood from '@/data/laws/ID-food.json';
import jpCosmetics from '@/data/laws/JP-cosmetics.json';
import jpElectronics from '@/data/laws/JP-electronics.json';
import jpFood from '@/data/laws/JP-food.json';
import usCosmetics from '@/data/laws/US-cosmetics.json';
import usElectronics from '@/data/laws/US-electronics.json';
import usFood from '@/data/laws/US-food.json';
import vnCosmetics from '@/data/laws/VN-cosmetics.json';
import vnElectronics from '@/data/laws/VN-electronics.json';
import vnFood from '@/data/laws/VN-food.json';
import notificationsJson from '@/data/notifications.json';
import prioritiesJson from '@/data/priorities.json';
import productsJson from '@/data/products.json';
import type {
  Action,
  Company,
  CountryCode,
  CountryInfo,
  ItemCategory,
  ItemCategoryId,
  Law,
  LawSet,
  Notification,
  Priority,
  Product,
} from '@/types/neo';

/**
 * 조합별 법령 세트. 파일 하나가 도착국 × 품목 하나다.
 *
 * 정적 임포트로 12개를 전부 묶는다. 동적 임포트를 쓰면 오프라인에서 조합을 바꿀 때
 * 네트워크를 타고, 서비스워커가 담아야 할 청크가 12개로 늘어난다.
 * 조합 하나가 법령 4~6건이라 전부 합쳐도 번들에 부담이 되지 않는다.
 */
const LAW_SETS = {
  'VN-food': vnFood,
  'VN-cosmetics': vnCosmetics,
  'VN-electronics': vnElectronics,
  'JP-food': jpFood,
  'JP-cosmetics': jpCosmetics,
  'JP-electronics': jpElectronics,
  'US-food': usFood,
  'US-cosmetics': usCosmetics,
  'US-electronics': usElectronics,
  'ID-food': idFood,
  'ID-cosmetics': idCosmetics,
  'ID-electronics': idElectronics,
} as unknown as Record<string, LawSet>;

export function lawSetKey(country: CountryCode, category: ItemCategoryId): string {
  return `${country}-${category}`;
}

/** 조합의 법령 세트. 지원하지 않는 조합이면 빈 세트다 — 없는 것을 지어내지 않는다. */
export function lawSetOf(country: CountryCode, category: ItemCategoryId): LawSet {
  return LAW_SETS[lawSetKey(country, category)] ?? EMPTY_SET;
}

const EMPTY_SET: LawSet = { laws: [], actions: [] };

// JSON 임포트는 리터럴 유니온을 잃고 string으로 넓어진다.
// 참조무결성·값 범위는 scripts/check-data.mjs가 검증한다.
//
// 아래 laws·actions는 B3에서 프로필 셀렉터로 갈아탈 때까지 남는 고정 조합이다.
// B2는 그릇만 바꾸는 단계라 화면이 보는 값이 이관 전과 같아야 한다.
export const laws = (LAW_SETS['VN-food'] as LawSet).laws;
export const actions = (LAW_SETS['VN-food'] as LawSet).actions;
export const products = productsJson as unknown as Product[];
export const priorities = prioritiesJson as unknown as Priority[];
export const notifications = notificationsJson as unknown as Notification[];
export const company = companyJson as unknown as Company;
export const countries = countriesJson as unknown as CountryInfo[];
export const categories = categoriesJson as unknown as ItemCategory[];

export const countryByCode = (code: CountryCode) =>
  countries.find((c) => c.code === code);
export const categoryById = (id: ItemCategoryId) =>
  categories.find((c) => c.id === id);

/** 출발국 후보. 도착국과 달리 법령 데이터가 필요 없다 — 항로만 그리면 된다. */
export const originCountries = countries.filter((c) => c.origin);
/** 도착국 목록. supported가 아닌 것도 남긴다 — 흐리게, 선택 불가로 그린다. */
export const destinationCountries = countries.filter((c) => c.destination);

export const lawById = (id: string) => laws.find((l) => l.id === id);
export const actionById = (id: string) => actions.find((a) => a.id === id);
export const productById = (id: string) => products.find((p) => p.id === id);

/** 한 법률에 걸린 액션들. law.actionIds 순서를 지킨다. */
export function actionsOfLaw(law: Law): Action[] {
  return law.actionIds
    .map((id) => actionById(id))
    .filter((a): a is Action => a !== undefined);
}

/** 한 법률의 영향 제품들. law.affectedProductIds 순서를 지킨다. */
export function productsOfLaw(law: Law): Product[] {
  return law.affectedProductIds
    .map((id) => productById(id))
    .filter((p): p is Product => p !== undefined);
}
