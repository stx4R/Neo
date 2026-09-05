// 데이터 참조무결성 검사. 조합을 하나 완성할 때마다 돌린다.
//
//   node scripts/check-data.mjs
//
// 화면이 데이터를 믿고 그리므로 참조가 끊기면 조용히 빈칸이 되거나 크래시한다.
// 타입 검사는 JSON을 통과시키지 못하니(임포트 시 string으로 넓어진다) 여기서 본다.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// URL.pathname은 한글 경로를 퍼센트 인코딩한 채로 준다. fileURLToPath를 거쳐야 한다.
const DATA = fileURLToPath(new URL('../data/', import.meta.url));

const read = (p) => JSON.parse(readFileSync(join(DATA, p), 'utf8'));

const countries = read('countries.json');
const categories = read('categories.json');

const CATEGORY_KEYS = ['labeling', 'safety', 'packaging', 'customs'];
const RISK = ['critical', 'high', 'medium', 'low'];
const STATUS = ['active', 'hold', 'scheduled'];
const TIER = ['official', 'secondary'];

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

// ── countries.json ────────────────────────────────────────────
const codes = new Set();
for (const c of countries) {
  const at = `countries/${c.code}`;
  if (!/^[A-Z]{2}$/.test(c.code)) fail(at, '코드가 2글자 대문자가 아니다');
  if (codes.has(c.code)) fail(at, '코드가 중복이다');
  codes.add(c.code);
  if (typeof c.lat !== 'number' || typeof c.lng !== 'number') fail(at, 'lat/lng가 없다');
  if (c.lat < -90 || c.lat > 90) fail(at, `lat 범위를 벗어났다 (${c.lat})`);
  if (c.lng < -180 || c.lng > 180) fail(at, `lng 범위를 벗어났다 (${c.lng})`);
  if (c.supported && !c.destination) fail(at, 'supported인데 destination이 아니다');
}

// ── categories.json ───────────────────────────────────────────
const catIds = new Set();
const defaultProductIds = new Map(); // categoryId -> Set(productId)
for (const c of categories) {
  const at = `categories/${c.id}`;
  catIds.add(c.id);
  defaultProductIds.set(c.id, new Set(c.defaultProducts.map((p) => p.id)));
  if (!c.hsPrefixes?.length) fail(at, 'hsPrefixes가 비었다');
  for (const p of c.defaultProducts) {
    const digits = p.hsCode.replace(/\D/g, '');
    if (digits.length !== 4 && digits.length !== 6) {
      fail(`${at}/${p.id}`, `HS코드가 4자리도 6자리도 아니다 (${p.hsCode})`);
    }
    if (!c.hsPrefixes.some((x) => digits.startsWith(x))) {
      fail(`${at}/${p.id}`, `HS코드가 품목 hsPrefixes 밖이다 (${p.hsCode})`);
    }
  }
}

// ── data/laws/*.json ──────────────────────────────────────────
const files = readdirSync(join(DATA, 'laws')).filter((f) => f.endsWith('.json')).sort();
let lawCount = 0;
let actionCount = 0;
const tierCount = { official: 0, secondary: 0 };

for (const file of files) {
  const key = file.replace('.json', '');
  const [country, category] = key.split('-');
  const set = read(`laws/${file}`);

  if (!codes.has(country)) fail(file, `countries.json에 없는 국가다 (${country})`);
  if (!catIds.has(category)) fail(file, `categories.json에 없는 품목이다 (${category})`);
  if (!Array.isArray(set.laws) || !Array.isArray(set.actions)) {
    fail(file, 'laws/actions 배열이 아니다');
    continue;
  }

  const actionIds = new Set(set.actions.map((a) => a.id));
  const lawIds = new Set(set.laws.map((l) => l.id));
  const usedActions = new Set();
  const defaults = defaultProductIds.get(category) ?? new Set();
  const catPrefixes = categories.find((c) => c.id === category)?.hsPrefixes ?? [];

  for (const law of set.laws) {
    lawCount += 1;
    const at = `${file}/${law.id}`;

    if (law.country !== country) fail(at, `country가 파일과 다르다 (${law.country})`);
    if (!law.itemCategories?.includes(category)) {
      fail(at, `itemCategories에 ${category}가 없다`);
    }
    if (!new RegExp(`^${country}-\\d{4}-\\d{3}$`).test(law.id)) {
      fail(at, 'id가 <국가>-<연도>-<번호> 형식이 아니다');
    }
    if (!CATEGORY_KEYS.includes(law.category)) fail(at, `category 값이 이상하다 (${law.category})`);
    if (!RISK.includes(law.riskLevel)) fail(at, `riskLevel 값이 이상하다 (${law.riskLevel})`);
    if (!STATUS.includes(law.status)) fail(at, `status 값이 이상하다 (${law.status})`);
    if (!TIER.includes(law.sourceTier)) fail(at, `sourceTier 값이 이상하다 (${law.sourceTier})`);
    else tierCount[law.sourceTier] += 1;
    if (!law.addedAt) fail(at, 'addedAt이 없다');
    if (law.status === 'hold' && !law.heldAt) fail(at, 'hold인데 heldAt이 없다');
    if (!law.source?.url) fail(at, 'source.url이 없다');
    if (!law.source?.lastVerified) fail(at, 'source.lastVerified가 없다');

    if (!law.hsPrefixes?.length) fail(at, 'hsPrefixes가 비었다');
    for (const prefix of law.hsPrefixes ?? []) {
      // 법령 prefix는 품목 prefix보다 좁거나 같아야 한다. 한쪽이 다른 쪽의 앞자리면 된다.
      const ok = catPrefixes.some((c) => prefix.startsWith(c) || c.startsWith(prefix));
      if (!ok) fail(at, `hsPrefix ${prefix}가 품목 ${category}의 범위 밖이다`);
    }

    for (const id of law.affectedProductIds ?? []) {
      if (!defaults.has(id)) fail(at, `affectedProductId ${id}가 품목 기본 세트에 없다`);
    }
    for (const id of law.actionIds ?? []) {
      if (!actionIds.has(id)) fail(at, `actionId ${id}가 실재하지 않는다`);
      if (usedActions.has(id)) fail(at, `actionId ${id}가 두 법령에 걸려 있다`);
      usedActions.add(id);
    }
    for (const code of law.originScope ?? []) {
      if (!codes.has(code)) fail(at, `originScope의 ${code}가 countries.json에 없다`);
    }
  }

  for (const a of set.actions) {
    actionCount += 1;
    const at = `${file}/${a.id}`;
    if (!a.id.startsWith(`${country}-`)) fail(at, '액션 id에 국가 접두어가 없다');
    if (!lawIds.has(a.lawId)) fail(at, `lawId ${a.lawId}가 이 파일에 없다`);
    if (!usedActions.has(a.id)) fail(at, '어느 법령의 actionIds에도 걸려 있지 않다');
  }
}

const filled = files.filter((f) => read(`laws/${f}`).laws.length > 0);
console.log(
  `조합 ${files.length}개 (내용 있음 ${filled.length}) · 법령 ${lawCount} · 액션 ${actionCount}` +
    ` · 출처 1차 ${tierCount.official} / 2차 ${tierCount.secondary}`,
);

if (problems.length > 0) {
  console.error(`\n참조무결성 실패 ${problems.length}건`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log('참조무결성 통과');
