'use client';

import { Row, RowTitle } from '@/components/Row';
import { Section } from '@/components/Screen';
import { RiskText } from '@/components/RiskText';
import { useDataset } from '@/lib/dataset';
import { productsOfLaw } from '@/lib/derive';
import type { Law } from '@/types/neo';

/**
 * AFFECTED — 이 법령이 걸리는 제품.
 *
 * 클라이언트인 이유: 제품은 프로필(localStorage)에서 오고, 판정은 HS 앞자리다.
 * 법령 본문은 프로필과 무관하므로 페이지는 그대로 서버 컴포넌트로 두고
 * 이 조각만 떼어냈다.
 *
 * 걸리는 제품이 없으면 섹션 자체를 그리지 않는다. "0건"을 적지 않는다.
 */
export function Affected({ law }: { law: Law }) {
  const ds = useDataset();
  if (!ds) return null;

  const products = productsOfLaw(ds, law);
  if (products.length === 0) return null;

  return (
    <Section label={`AFFECTED — ${products.length}`}>
      {products.map((product, i) => (
        <Row
          key={product.id}
          height="short"
          last={i === products.length - 1}
          trailing={
            <>
              <span className="t-meta tnum" style={{ flex: 'none', color: 'var(--text-3)' }}>
                HS {product.hsCode}
              </span>
              {/* impact는 법령에 종속된 값이라 /setup에서 만든 제품에는 없다.
                  없으면 칸 자체를 그리지 않는다 — 중립값으로 채우지 않는다. */}
              {product.impact && (
                <span
                  className="t-meta"
                  style={{ flex: 'none', width: 64, textAlign: 'right' }}
                >
                  <RiskText level={product.impact} />
                </span>
              )}
            </>
          }
        >
          <RowTitle as="span">{product.name}</RowTitle>
        </Row>
      ))}
    </Section>
  );
}
