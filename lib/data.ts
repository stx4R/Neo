import actionsJson from '@/data/actions.json';
import categoriesJson from '@/data/categories.json';
import companyJson from '@/data/company.json';
import countriesJson from '@/data/countries.json';
import lawsJson from '@/data/laws.json';
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
  Notification,
  Priority,
  Product,
} from '@/types/neo';

// JSON 임포트는 리터럴 유니온을 잃고 string으로 넓어진다.
// 참조무결성·값 범위는 2단계에서 이미 검증했으므로 여기서 타입만 되돌린다.
export const laws = lawsJson as unknown as Law[];
export const actions = actionsJson as unknown as Action[];
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
