'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { TextField } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { IconButton } from '@/components/TopBar';
import { categories, destinationCountries, originCountries } from '@/lib/data';
import { readProfile, saveProfile } from '@/lib/useProfile';
import type { CountryCode, ItemCategoryId, Product, Profile } from '@/types/neo';
import { ChoiceRow, StepFooter, StepHead, StepSection, WARNING_H } from './parts';

/**
 * S7·S8 — 첫 실행 온보딩. 탭바 없음.
 *
 * 4스텝: ① 출발국 ② 도착국 ③ 품목 ④ 회사명·제품(건너뛰기 가능).
 * ①②③은 S7 선택 목록형, ④만 S8 입력형이다.
 *
 * ?edit=1이면 기존 값을 프리필하고, 완료 시 이전 화면으로 돌아간다.
 * 국가나 품목이 실제로 바뀐 경우에만 초기화 경고를 띄운다.
 */

const TOTAL = 4;
const MAX_PRODUCTS = 4;

/** 편집 중인 제품 한 줄. HS코드는 검증 전이라 문자열 그대로 들고 있는다. */
interface Draft {
  key: string;
  name: string;
  hs: string;
}

/** 4자리 또는 6자리 숫자만 허용한다. 점은 자리 구분이라 세지 않는다. */
function digitsOf(hs: string): string {
  return hs.replace(/\D/g, '');
}

function hsValid(hs: string): boolean {
  const n = digitsOf(hs).length;
  return n === 4 || n === 6;
}

/** 저장 형태로 정규화한다. 6자리는 '2103.90', 4자리는 '2103'. */
function normalizeHs(hs: string): string {
  const d = digitsOf(hs);
  return d.length === 6 ? `${d.slice(0, 4)}.${d.slice(4)}` : d;
}

function toDrafts(products: readonly Product[]): Draft[] {
  return products.map((p, i) => ({ key: `${p.id}-${i}`, name: p.name, hs: p.hsCode }));
}

export default function SetupPage() {
  // useSearchParams는 Suspense 경계를 요구한다. 경계 안은 프레임까지 포함해야
  // 폴백이 뜨는 동안 바탕이 비지 않는다.
  return (
    <Suspense fallback={<Screen bg="canvas" scrollPadBottom="var(--pad-plain)">{null}</Screen>}>
      <Setup />
    </Suspense>
  );
}

function Setup() {
  const router = useRouter();
  const params = useSearchParams();
  // 프로필이 없는데 ?edit=1로 들어온 경우는 첫 실행으로 다룬다.
  const [saved] = useState(() => readProfile());
  const editing = params.get('edit') === '1' && saved !== null;

  // ?step=4 는 S4의 '편집'·'제품 추가'가 쓰는 통로다. 제품 편집기를 두 벌 만들지 않는다.
  const [step, setStep] = useState(() => {
    const n = Number(params.get('step'));
    return Number.isInteger(n) && n >= 1 && n <= TOTAL && saved !== null ? n - 1 : 0;
  });
  const [origin, setOrigin] = useState<CountryCode | null>(saved?.originCountry ?? 'KR');
  const [destination, setDestination] = useState<CountryCode | null>(
    saved?.destinationCountry ?? null,
  );
  const [category, setCategory] = useState<ItemCategoryId | null>(
    saved?.itemCategory ?? null,
  );
  const [companyName, setCompanyName] = useState(saved?.companyName ?? '');
  const [drafts, setDrafts] = useState<Draft[]>(() => toDrafts(saved?.products ?? []));
  // 제출을 눌러 본 뒤에만 오류를 그린다. 입력하는 도중에 빨간 선이 따라다니면 안 된다.
  const [showErrors, setShowErrors] = useState(false);

  // 품목을 고르면 기본 제품 세트를 복사한다. 이미 편집한 목록은 덮지 않는다.
  function pickCategory(id: ItemCategoryId) {
    setCategory(id);
    if (id !== saved?.itemCategory || drafts.length === 0) {
      const seed = categories.find((c) => c.id === id)?.defaultProducts ?? [];
      setDrafts(toDrafts(seed));
    }
  }

  const countryChanged =
    editing &&
    (origin !== saved.originCountry || destination !== saved.destinationCountry);
  const categoryChanged = editing && category !== saved.itemCategory;
  const warning =
    countryChanged && categoryChanged
      ? '국가·품목을 바꾸면 완료 표시가 초기화돼요'
      : countryChanged
        ? '국가를 바꾸면 완료 표시가 초기화돼요'
        : categoryChanged
          ? '품목을 바꾸면 완료 표시가 초기화돼요'
          : undefined;

  function commit(products: Product[]) {
    const next: Profile = {
      ...(companyName.trim() ? { companyName: companyName.trim() } : {}),
      originCountry: origin as CountryCode,
      destinationCountry: destination as CountryCode,
      itemCategory: category as ItemCategoryId,
      products,
      updatedAt: new Date().toISOString(),
    };
    saveProfile(next);
    // 뒤로가기로 setup에 돌아오지 않게 replace로 나간다.
    if (editing) router.back();
    else router.replace('/');
  }

  /** ④를 건너뛴다. 회사명은 남기지 않고 제품은 품목 기본 세트를 쓴다. */
  function skip() {
    const seed = categories.find((c) => c.id === category)?.defaultProducts ?? [];
    setCompanyName('');
    const next: Profile = {
      originCountry: origin as CountryCode,
      destinationCountry: destination as CountryCode,
      itemCategory: category as ItemCategoryId,
      products: seed.map((p) => ({ ...p })),
      updatedAt: new Date().toISOString(),
    };
    saveProfile(next);
    if (editing) router.back();
    else router.replace('/');
  }

  function finish() {
    const filled = drafts.filter((d) => d.name.trim() || d.hs.trim());
    if (filled.some((d) => !hsValid(d.hs))) {
      setShowErrors(true);
      return;
    }
    commit(
      filled.map((d, i) => ({
        // 조합이 바뀌어도 충돌하지 않게 품목 접두어를 붙인다.
        id: `p-${category}-u${i + 1}`,
        name: d.name.trim() || `제품 ${i + 1}`,
        hsCode: normalizeHs(d.hs),
      })),
    );
  }

  const canAdvance =
    step === 0 ? origin !== null : step === 1 ? destination !== null : category !== null;

  const scrollPadBottom = warning
    ? `calc(var(--pad-cta) + ${WARNING_H}px)`
    : 'var(--pad-cta)';

  return (
    <Screen
      bg="canvas"
      scrollPadBottom={scrollPadBottom}
      footer={
        <StepFooter
          label={step < TOTAL - 1 ? '다음' : editing ? '저장' : '시작하기'}
          enabled={step < TOTAL - 1 ? canAdvance : true}
          onPress={() => (step < TOTAL - 1 ? setStep(step + 1) : finish())}
          warning={warning}
        />
      }
    >
      {step === 0 && (
        <>
          <StepHead
            step={1}
            total={TOTAL}
            title="어디서 수출하세요?"
            hint="출발하는 나라를 골라 주세요"
            onBack={editing ? () => router.back() : undefined}
          />
          <StepSection>
            <Card padding={6}>
              {originCountries.map((c, i) => (
                <ChoiceRow
                  key={c.code}
                  code={c.code}
                  name={c.nameKo}
                  selected={origin === c.code}
                  afterSelected={origin === originCountries[i - 1]?.code}
                  first={i === 0}
                  onSelect={() => setOrigin(c.code)}
                />
              ))}
            </Card>
          </StepSection>
        </>
      )}

      {step === 1 && (
        <DestinationStep value={destination} onPick={setDestination} onBack={() => setStep(0)} />
      )}

      {step === 2 && (
        <>
          <StepHead
            step={3}
            total={TOTAL}
            title="어떤 품목을 수출하세요?"
            hint="품목마다 걸리는 규제가 달라요"
            onBack={() => setStep(1)}
          />
          {/* 품목에는 국가 코드에 해당하는 값이 없다. 빈 코드 열을 만들어
              채우지 않는다 — 데이터가 없으면 표시하지 않는다. */}
          <StepSection>
            <Card padding={6}>
              {categories.map((c, i) => (
                <ChoiceRow
                  key={c.id}
                  name={c.nameKo}
                  selected={category === c.id}
                  afterSelected={category === categories[i - 1]?.id}
                  first={i === 0}
                  onSelect={() => pickCategory(c.id)}
                />
              ))}
            </Card>
          </StepSection>
        </>
      )}

      {step === 3 && (
        <ProductsStep
          companyName={companyName}
          onCompanyName={setCompanyName}
          drafts={drafts}
          onDrafts={setDrafts}
          showErrors={showErrors}
          onBack={() => setStep(2)}
          onSkip={skip}
        />
      )}
    </Screen>
  );
}

function DestinationStep({
  value,
  onPick,
  onBack,
}: {
  value: CountryCode | null;
  onPick: (code: CountryCode) => void;
  onBack: () => void;
}) {
  const supported = destinationCountries.filter((c) => c.supported);
  const planned = destinationCountries.filter((c) => !c.supported);

  return (
    <>
      <StepHead
        step={2}
        total={TOTAL}
        title="어디로 수출하세요?"
        // 국가 수는 데이터에서 센다. 지원 국가가 늘면 문구가 따라간다.
        hint={`지금은 ${supported.length}개국의 법령 데이터가 있어요`}
        onBack={onBack}
      />
      <StepSection>
        <Card padding={6}>
          {supported.map((c, i) => (
            <ChoiceRow
              key={c.code}
              code={c.code}
              name={c.nameKo}
              selected={value === c.code}
              afterSelected={value === supported[i - 1]?.code}
              first={i === 0}
              onSelect={() => onPick(c.code)}
            />
          ))}
        </Card>
      </StepSection>
      {/* 아직 데이터가 없는 국가를 흐리게 남긴다. 이게 유일하게 허용되는
          "빈 데이터 표시"다 — 왜 4개국뿐인지에 정직하게 답하는 장치다. */}
      {planned.length > 0 && (
        <StepSection label="지원 예정">
          <Card padding={6}>
            {planned.map((c, i) => (
              <ChoiceRow
                key={c.code}
                code={c.code}
                name={c.nameKo}
                disabled
                first={i === 0}
                trailing={<Badge tone="neutral">준비 중</Badge>}
              />
            ))}
          </Card>
        </StepSection>
      )}
    </>
  );
}

function ProductsStep({
  companyName,
  onCompanyName,
  drafts,
  onDrafts,
  showErrors,
  onBack,
  onSkip,
}: {
  companyName: string;
  onCompanyName: (v: string) => void;
  drafts: Draft[];
  onDrafts: (next: Draft[]) => void;
  showErrors: boolean;
  onBack: () => void;
  onSkip: () => void;
}) {
  function patch(i: number, part: Partial<Draft>) {
    onDrafts(drafts.map((d, j) => (j === i ? { ...d, ...part } : d)));
  }

  return (
    <>
      <StepHead
        step={4}
        total={TOTAL}
        title="회사와 제품을 알려주세요"
        hint="건너뛰면 품목 기본 제품으로 시작해요"
        onBack={onBack}
      />

      <div style={{ padding: '20px var(--pad) 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="t-label" style={{ color: 'var(--tds-fg-secondary)' }}>
            회사명 (선택)
          </span>
          <TextField
            value={companyName}
            onChange={onCompanyName}
            ariaLabel="회사명"
            placeholder="회사명을 입력해 주세요"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="t-label" style={{ color: 'var(--tds-fg-secondary)' }}>
            제품{' '}
            <span className="tnum" style={{ color: 'var(--tds-fg-quaternary)' }}>
              {drafts.length}/{MAX_PRODUCTS}
            </span>
          </span>

          {drafts.map((d, i) => {
            const invalid = showErrors && (d.name.trim() || d.hs.trim()) && !hsValid(d.hs);
            return (
              <div key={d.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TextField
                    value={d.name}
                    onChange={(v) => patch(i, { name: v })}
                    ariaLabel={`제품 ${i + 1} 이름`}
                    placeholder="제품명"
                  />
                  <TextField
                    value={d.hs}
                    onChange={(v) => patch(i, { hs: v })}
                    ariaLabel={`제품 ${i + 1} HS코드`}
                    placeholder="HS코드"
                    invalid={!!invalid}
                    width={104}
                    tnum
                    inputMode="numeric"
                    maxLength={7}
                  />
                  {/* 디자인 원본에는 없는 칸이다. 지우는 길이 없으면 품목 기본 세트에서
                      제품을 뺄 수 없다. 흐린 × 하나로 둔다. */}
                  <IconButton
                    icon="x"
                    label={`제품 ${i + 1} 삭제`}
                    onClick={() => onDrafts(drafts.filter((_, j) => j !== i))}
                    color="var(--tds-fg-quaternary)"
                    size={20}
                  />
                </div>
                {invalid && (
                  // HS 칸 오른쪽 끝에 맞춘다 — × 칸(40)과 사이(8)만큼 안으로 들인다.
                  <span
                    className="t-meta"
                    style={{ alignSelf: 'flex-end', marginRight: 48, color: 'var(--tds-fg-danger)' }}
                  >
                    HS 코드는 4자리 또는 6자리예요
                  </span>
                )}
              </div>
            );
          })}

          {drafts.length < MAX_PRODUCTS && (
            <button
              type="button"
              onClick={() => onDrafts([...drafts, { key: `new-${Date.now()}`, name: '', hs: '' }])}
              style={{
                alignSelf: 'flex-start',
                height: 44,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--tds-fg-brand)',
                cursor: 'pointer',
              }}
            >
              <Icon name="plus" size={18} stroke={2} />
              <span className="t-body-b" style={{ lineHeight: 1 }}>
                제품 추가
              </span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onSkip}
          className="tap-y"
          style={{
            alignSelf: 'flex-start',
            font: '500 15px/1 var(--font)',
            color: 'var(--tds-fg-tertiary)',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          건너뛰기
        </button>
      </div>
    </>
  );
}
