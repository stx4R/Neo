// NEO 데이터 모델. PRD v2 §5.

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type LawStatus = 'active' | 'hold' | 'scheduled';
export type Category = 'labeling' | 'safety' | 'packaging' | 'customs';

export interface Law {
  id: string;                 // 'VN-2026-037'
  officialRef: string;        // 'DECREE 37/2026' — Label 스타일로 그대로 출력
  title: string;
  country: 'VN';
  category: Category;         // Priority.category와 매칭되는 키
  status: LawStatus;
  riskLevel: RiskLevel;
  effectiveDate: string;      // 시행일 (ISO)
  deadline: string | null;    // 사내 대응 마감일 — D-Day 계산 기준
  heldAt?: string;            // status === 'hold' 일 때 보류된 날짜
  transitionEndsAt?: string;  // 경과규정 종료일
  transitionNote?: string;
  changes: { before: string; after: string }[];
  affectedProductIds: string[];
  actionIds: string[];
  source: {
    url: string;
    publisher: string;
    publishedAt: string;
    originalLang: 'vi' | 'en';
    lastVerified: string;
  };
}

export interface Action {
  id: string;
  lawId: string;
  title: string;
  owner: string;              // '품질팀'
  effort: string;             // '2주'
  dueDate: string | null;
}

export interface Product {
  id: string;
  name: string;
  hsCode: string;             // '2103.90' — tabular-nums로 출력
  impact: RiskLevel;
}

export interface Priority {
  id: string;
  name: string;               // '라벨링·표시'
  category: Category;
}

export interface Company {
  name: string;
  industry: string;
  countries: { code: string; name: string; active: boolean }[];
  productIds: string[];
}

export interface Notification {
  id: string;
  type: 'deadline' | 'status' | 'new' | 'done';
  lawId: string | null;
  title: string;
  body: string;
  at: string;                 // ISO
}

// ── 표시 상수. 여기서만 정의한다. ──────────────────────────────

export const STATUS_MARK = {
  active: '施',
  hold: '留',
  scheduled: '豫',
} as const satisfies Record<LawStatus, string>;

export const STATUS_COLOR = {
  active: 'var(--accent)',
  hold: 'var(--hold)',
  scheduled: 'var(--text-3)',
} as const satisfies Record<LawStatus, string>;

export const RISK_COLOR = {
  critical: 'var(--risk-critical)',
  high: 'var(--risk-high)',
  medium: 'var(--risk-medium)',
  low: 'var(--risk-low)',
} as const satisfies Record<RiskLevel, string>;

export const RISK_LABEL = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
} as const satisfies Record<RiskLevel, string>;

export const NOTIFICATION_LABEL = {
  deadline: '시행 임박',
  status: '상태 변경',
  new: '신규 규제',
  done: '액션 완료',
} as const;

export const NOTIFICATION_COLOR = {
  deadline: 'var(--risk-critical)',
  status: 'var(--hold)',
  new: 'var(--risk-high)',
  done: 'var(--risk-low)',
} as const;
