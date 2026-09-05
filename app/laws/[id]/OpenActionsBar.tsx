'use client';

import { useRouter } from 'next/navigation';
import { useDataset } from '@/lib/dataset';
import { actionsOfLaw } from '@/lib/derive';
import { useActionsDone } from '@/lib/useActionsDone';
import type { Law } from '@/types/neo';

/**
 * S3 하단 고정 바.
 *
 * 인수인계의 "액션 N건 담기"를 버렸다. 담을 곳이 없었기 때문이다 —
 * 우리 데이터 모델에 장바구니가 없고, 그걸 만들려면 neo.pinned 같은 새 상태가
 * 필요한데 그 상태를 쓰는 화면이 없다. 지금은 **미완 액션 수를 말하고
 * Home의 MUST DO NOW로 보내는** 안내다. 새 상태를 만들지 않는다.
 *
 * 미완이 0건이면 바 자체를 렌더하지 않는다. 할 일이 없는데 할 일 바를
 * 띄워 두지 않는다. 판단이 이 파일 안에 있으므로 페이지 쪽에서 여백도 같이
 * 줄이려면 여기가 아니라 저쪽에서 다시 세어야 한다 — 그래서 여백은
 * 액션 유무가 아니라 '바가 있을 수 있는가'로만 잡는다.
 */
export function OpenActionsBar({ law }: { law: Law }) {
  const done = useActionsDone();
  const router = useRouter();
  const ds = useDataset();
  // 공용 법령은 액션이 품목별로 갈린다. 지금 조합의 것만 센다.
  const open = ds ? actionsOfLaw(ds, law).filter((a) => !done.has(a.id)).length : 0;

  if (open === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
        // 탭바와 같은 규칙이다 — bottom: 0에 붙이고 안전영역은 패딩으로만 흡수한다.
        paddingBottom: 'var(--safe-bottom)',
        background: 'var(--bg)',
        borderTop: '1px solid var(--hairline)',
      }}
    >
      <div
        style={{
          height: 'var(--ctabar-cell)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 var(--pad)',
        }}
      >
        <button
          type="button"
          onClick={() => router.push('/')}
          style={{
            width: '100%',
            height: 44,
            display: 'flex',
            alignItems: 'center',
            padding: '0 var(--block-pad)',
            border: 'none',
            background: 'var(--accent)',
            cursor: 'pointer',
          }}
        >
          <span className="t-h2" style={{ color: 'var(--on-color)' }}>
            이 법령의 미완 액션 <span className="tnum">{open}</span>건
          </span>
        </button>
      </div>
    </div>
  );
}
