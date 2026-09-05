'use client';

import Link from 'next/link';

/**
 * S9 EMPTY — 지금 조합에 법령 데이터가 없을 때.
 *
 * EmptyState와 다른 물건이다. 저쪽은 필터 결과 0건처럼 "찾은 게 없다"를 말하고
 * 문구가 --text-3이다. 이쪽은 "우리가 아직 안 채웠다"를 말하고 첫 줄이 --text다.
 * 아트보드 S9에서 실측했다.
 *
 * 아트보드의 예시 문구는 `VN 베트남 · 화장품`인데 그 조합은 지원 대상이다.
 * 여기서는 지금 프로필의 조합을 그대로 적는다. 12조합을 전부 채우고 나면
 * 이 화면은 **데이터 로드 실패 방어용**으로만 남는다 — 조합 파일이 비었거나
 * 깨졌을 때 빈 목록 대신 무슨 일인지 말해 주는 자리다.
 */
export function ComboEmpty({ combo }: { combo: string }) {
  return (
    <div>
      <p className="t-body" style={{ margin: 0, color: 'var(--text)' }}>
        이 조합의 규제 데이터가 아직 없습니다
      </p>
      <p className="t-meta" style={{ margin: 'var(--stack) 0 0', color: 'var(--text-3)' }}>
        {combo}
      </p>
      <div style={{ marginTop: 14 }}>
        <Link href="/setup?edit=1" className="t-body">
          다른 조합 고르기
        </Link>
      </div>
    </div>
  );
}

/**
 * 프로필을 아직 읽지 못한 한 프레임 동안의 자리.
 *
 * 프로필은 localStorage에 있고 useSyncExternalStore는 hydration 렌더에서
 * 서버 스냅샷을 쓴다. 그 사이를 0이나 예시 데이터로 채우면 잘못된 값이
 * 한 프레임 스쳐 지나간다. shimmer 금지, opacity 펄스만.
 */
export function ComboPending() {
  return (
    <div
      className="neo-pulse"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lbl-gap)' }}
    >
      <div style={{ width: '60%', height: 22, background: 'var(--surface)' }} />
      <div style={{ width: '85%', height: 22, background: 'var(--surface)' }} />
      <div style={{ width: '45%', height: 22, background: 'var(--surface)' }} />
    </div>
  );
}
