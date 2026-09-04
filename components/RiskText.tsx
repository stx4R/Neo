import { RISK_COLOR, RISK_LABEL, type RiskLevel } from '@/types/neo';

/** 'HIGH' 등 위험도 단어를 해당 색 텍스트로. 색면이 아니라 글자색이다. */
export function RiskText({ level }: { level: RiskLevel }) {
  return <span style={{ color: RISK_COLOR[level] }}>{RISK_LABEL[level]}</span>;
}
