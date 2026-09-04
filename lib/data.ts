import actionsJson from '@/data/actions.json';
import companyJson from '@/data/company.json';
import lawsJson from '@/data/laws.json';
import notificationsJson from '@/data/notifications.json';
import prioritiesJson from '@/data/priorities.json';
import productsJson from '@/data/products.json';
import type { Action, Company, Law, Notification, Priority, Product } from '@/types/neo';

// JSON 임포트는 리터럴 유니온을 잃고 string으로 넓어진다.
// 참조무결성·값 범위는 2단계에서 이미 검증했으므로 여기서 타입만 되돌린다.
export const laws = lawsJson as unknown as Law[];
export const actions = actionsJson as unknown as Action[];
export const products = productsJson as unknown as Product[];
export const priorities = prioritiesJson as unknown as Priority[];
export const notifications = notificationsJson as unknown as Notification[];
export const company = companyJson as unknown as Company;

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
