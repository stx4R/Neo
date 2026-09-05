import categoriesJson from '@/data/categories.json';
import companyJson from '@/data/company.json';
import countriesJson from '@/data/countries.json';
import idCosmetics from '@/data/laws/ID-cosmetics.json';
import idElectronics from '@/data/laws/ID-electronics.json';
import idFood from '@/data/laws/ID-food.json';
import idShared from '@/data/laws/ID-shared.json';
import jpCosmetics from '@/data/laws/JP-cosmetics.json';
import jpElectronics from '@/data/laws/JP-electronics.json';
import jpFood from '@/data/laws/JP-food.json';
import jpShared from '@/data/laws/JP-shared.json';
import usCosmetics from '@/data/laws/US-cosmetics.json';
import usElectronics from '@/data/laws/US-electronics.json';
import usFood from '@/data/laws/US-food.json';
import usShared from '@/data/laws/US-shared.json';
import vnCosmetics from '@/data/laws/VN-cosmetics.json';
import vnElectronics from '@/data/laws/VN-electronics.json';
import vnFood from '@/data/laws/VN-food.json';
import vnShared from '@/data/laws/VN-shared.json';
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
  Priority,
  Product,
} from '@/types/neo';

/**
 * 법령 파일. `<국가>-<품목>`은 그 조합 전용이고, `<국가>-shared`는 품목을 가리지 않는
 * 법령이다 — 상품 라벨 시행령처럼 식품·화장품·전기전자에 전부 걸리는 것들.
 *
 * 공용 법령을 조합 파일마다 복사하지 않는 이유: 법령 id가 전역에서 유일해야
 * `/laws/[id]` 정적 생성과 id 조회가 성립한다. 복사하면 id 하나가 서로 다른
 * 액션 집합 여럿을 가리키게 된다. 대신 **액션 쪽에 품목을 단다**(`Action.itemCategories`).
 *
 * 정적 임포트로 전부 묶는다. 동적 임포트를 쓰면 오프라인에서 조합을 바꿀 때
 * 네트워크를 타고, 서비스워커가 담아야 할 청크가 그만큼 늘어난다.
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
  'VN-shared': vnShared,
  'JP-shared': jpShared,
  'US-shared': usShared,
  'ID-shared': idShared,
} as unknown as Record<string, LawSet>;

export function lawSetKey(country: CountryCode, category: ItemCategoryId): string {
  return `${country}-${category}`;
}

/**
 * 조합의 법령 세트 — 조합 전용 + 그 품목에 걸리는 공용 법령.
 * 지원하지 않는 조합이면 빈 세트다. 없는 것을 지어내지 않는다.
 *
 * 액션은 `itemCategories`가 없거나 이 품목을 포함하는 것만 남는다.
 */
export function lawSetOf(country: CountryCode, category: ItemCategoryId): LawSet {
  const own = LAW_SETS[lawSetKey(country, category)] ?? EMPTY_SET;
  const shared = LAW_SETS[`${country}-shared`] ?? EMPTY_SET;

  const sharedLaws = shared.laws.filter((l) => l.itemCategories.includes(category));
  if (sharedLaws.length === 0) return own;

  const ids = new Set(sharedLaws.map((l) => l.id));
  const sharedActions = shared.actions.filter(
    (a) => ids.has(a.lawId) && (!a.itemCategories || a.itemCategories.includes(category)),
  );

  return {
    // 공용 법령을 앞에 세운다 — 품목을 가리지 않는 규정이 대개 더 넓게 걸린다.
    laws: [...sharedLaws, ...own.laws],
    actions: [...sharedActions, ...own.actions],
  };
}

const EMPTY_SET: LawSet = { laws: [], actions: [] };

/** 12조합 전부의 법령. `/laws/[id]` 정적 생성과 id 조회에만 쓴다. */
export const allLaws: Law[] = Object.values(LAW_SETS).flatMap((set) => set.laws);
const ALL_ACTIONS: Action[] = Object.values(LAW_SETS).flatMap((set) => set.actions);

/**
 * 법령 하나를 id로 찾는다. 조합을 가리지 않는다 —
 * 법령 id(`<국가>-<연도>-<번호>`)가 이미 전역에서 유일하고, S3의 본문은
 * 프로필과 무관하게 그 법령의 내용이기 때문이다. 프로필에 매인 것은
 * 영향 제품과 하단 CTA뿐이라 그쪽만 클라이언트에서 그린다.
 */
export const lawById = (id: string) => allLaws.find((l) => l.id === id);
export const actionById = (id: string) => ALL_ACTIONS.find((a) => a.id === id);

/** 한 법률에 걸린 액션들. law.actionIds 순서를 지킨다. */
export function actionsOfLaw(law: Law): Action[] {
  return law.actionIds
    .map((id) => actionById(id))
    .filter((a): a is Action => a !== undefined);
}

/**
 * 법령이 걸리는 제품. **id 목록이 아니라 HS 앞자리로 판정한다.**
 *
 * `affectedProductIds`는 품목 기본 세트를 가리키는데, 사용자가 /setup에서
 * 제품을 편집하면 그 id는 더 이상 존재하지 않는다. HS코드는 사용자가 직접 넣는
 * 값이라 언제나 대조할 수 있다. B2에서 두 기준이 VN 식품 5건 전부에 대해
 * 같은 집합을 낸다는 것을 검산했다(DISCREPANCIES §54).
 */
export function productsMatching(law: Law, pool: readonly Product[]): Product[] {
  // 빈 hsPrefixes는 '품목을 가리지 않는다'는 뜻이다. 전 제품이 걸린다.
  if (law.hsPrefixes.length === 0) return [...pool];
  return pool.filter((p) => {
    const digits = p.hsCode.replace(/\D/g, '');
    return law.hsPrefixes.some((prefix) => digits.startsWith(prefix));
  });
}

// JSON 임포트는 리터럴 유니온을 잃고 string으로 넓어진다.
// 참조무결성·값 범위는 scripts/check-data.mjs가 검증한다.
export const seedProducts = productsJson as unknown as Product[];
export const priorities = prioritiesJson as unknown as Priority[];
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
