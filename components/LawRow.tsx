import type { ReactNode } from 'react';
import { Badge } from '@/components/Badge';
import { CATEGORY_ICON, Icon } from '@/components/Icon';
import { IconTile } from '@/components/IconTile';
import { Row } from '@/components/Row';
import type { BadgeSpec } from '@/lib/derive';
import { RISK_LABEL, type Law } from '@/types/neo';

/**
 * 법령 행. 왼쪽 44px 타일이 규제 영역 아이콘을 위험도 색으로 칠하고,
 * 오른쪽 배지가 상태를 말한다. 한자 마커가 하던 일을 둘이 나눠 받았다 —
 * 위험도는 타일, 상태는 배지. 보류 법령은 행 전체를 흐린다.
 *
 * S2 목록과 S1 이번 주가 쓴다.
 */
export function LawRow({
  law,
  meta,
  badge,
  href,
  divider = true,
}: {
  law: Law;
  meta: ReactNode;
  badge: BadgeSpec;
  href?: string;
  divider?: boolean;
}) {
  return (
    <Row
      href={href}
      align="start"
      padding="16px 0"
      gap={4}
      divider={divider}
      dimmed={law.status === 'hold'}
      leading={
        <IconTile tone={law.riskLevel} label={`위험도 ${RISK_LABEL[law.riskLevel]}`}>
          <Icon name={CATEGORY_ICON[law.category]} size={22} />
        </IconTile>
      }
      trailing={
        <Badge tone={badge.tone} tnum={badge.tnum}>
          {badge.text}
        </Badge>
      }
    >
      <span className="t-caption tnum" style={{ color: 'var(--tds-fg-quaternary)' }}>
        {law.officialRef}
      </span>
      <span className="t-subtitle">{law.title}</span>
      <span className="t-meta tnum" style={{ color: 'var(--tds-fg-tertiary)' }}>
        {meta}
      </span>
    </Row>
  );
}
