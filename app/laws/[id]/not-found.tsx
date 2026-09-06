import Link from 'next/link';
import { Screen } from '@/components/Screen';

/**
 * 법령 상세의 404. `app/laws/[id]/page.tsx`의 `notFound()`가 여기로 온다.
 *
 * 전역 `app/not-found.tsx`와 나눈 이유: 전역이 "없는 법률입니다"라고 말하고 있었는데
 * `/no-such-page` 같은 법령이 아닌 주소에서도 그 문구가 떴다(4차 B8 실측).
 * 법령 id가 틀린 것과 주소 자체가 없는 것은 다른 일이고, 돌아갈 곳도 다르다.
 *
 * 탭바를 두지 않는다 — 목록으로 돌아가는 길 하나만 있는 모달성 화면이다.
 */
export default function LawNotFound() {
  return (
    <Screen scrollPadBottom="var(--pad-plain)">
      <div style={{ padding: '12px var(--pad) 0' }}>
        <h1 className="t-h1" style={{ margin: 0, color: 'var(--text)' }}>
          없는 법률입니다
        </h1>
        <p className="t-meta" style={{ margin: '10px 0 0', color: 'var(--text-3)' }}>
          주소가 바뀌었거나 목록에 없는 법령입니다
        </p>
        <div style={{ marginTop: 20 }}>
          <Link href="/laws" className="t-body tap-y">
            법률 목록으로
          </Link>
        </div>
      </div>
    </Screen>
  );
}
