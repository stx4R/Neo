// NEO 데이터 모델. PRD v2 §5.

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

/** 'KR' 'VN' 'JP' 'US' 'ID' … ISO 3166-1 alpha-2. 국기·이모지를 쓰지 않으므로 이게 표시값이다. */
export type CountryCode = string;
export type ItemCategoryId = 'food' | 'cosmetics' | 'electronics';
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
  /**
   * 이 제품이 받는 영향. 법령에 종속된 값이라 사용자가 /setup에서 만든 제품에는 없다.
   * 없으면 화면에서 그 칸을 그리지 않는다 — 0이나 중립색으로 채우지 않는다.
   */
  impact?: RiskLevel;
}

/**
 * 항로를 그릴 수 있는 국가. lat/lng가 없는 국가는 이 파일에 넣지 않는다.
 *
 * 플래그가 셋인 이유는 세 가지가 서로 다른 질문이기 때문이다.
 *   origin       출발국 목록에 나오는가
 *   destination  도착국 목록에 나오는가
 *   supported    도착국으로서 법령 데이터가 실제로 있는가
 * destination이면서 supported가 아닌 국가는 목록에 흐리게 남는다 —
 * "왜 4개국뿐인가"에 정직하게 답하는 장치다.
 */
export interface CountryInfo {
  code: CountryCode;
  nameKo: string;
  nameEn: string;
  lng: number;
  lat: number;
  origin: boolean;
  destination: boolean;
  supported: boolean;
}

export interface ItemCategory {
  id: ItemCategoryId;
  nameKo: string;
  /** 이 품목에 걸리는 HS 코드 앞자리. 법령의 hsPrefixes와 대조한다. */
  hsPrefixes: string[];
  /** 품목을 고르면 복사되는 기본 제품 세트. 이후 사용자가 편집한다. */
  defaultProducts: Product[];
}

/**
 * 사용자의 상황. localStorage 'neo.profile' 하나에 담긴다.
 * 이 값이 없으면 앱은 어느 경로로 들어와도 /setup으로 보낸다.
 */
export interface Profile {
  /** 선택 입력. 없으면 헤더에서 회사명 줄을 표시하지 않는다. */
  companyName?: string;
  originCountry: CountryCode;
  destinationCountry: CountryCode;
  itemCategory: ItemCategoryId;
  products: Product[];
  updatedAt: string;          // ISO
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

export const CATEGORY_LABEL = {
  labeling: '라벨링·표시',
  safety: '식품안전·인증',
  packaging: '포장·환경',
  customs: '통관·관세',
} as const satisfies Record<Category, string>;

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
