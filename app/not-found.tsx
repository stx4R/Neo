import Link from 'next/link';
import { Screen } from '@/components/Screen';

/**
 * 앱이 모르는 주소를 받는 화면. Next 기본 흰 화면이 뜨면 단일 다크 테마가 깨진다.
 *
 * 법령 id가 틀린 경우는 `app/laws/[id]/not-found.tsx`가 따로 받는다 —
 * 여기서 "없는 법률입니다"라고 말하면 법령이 아닌 주소에서 거짓말이 된다(4차 B8).
 *
 * 탭바를 두지 않는다 — 돌아가는 길 하나만 있는 모달성 화면이다.
 */
export default function NotFound() {
  return (
    <Screen scrollPadBottom="var(--pad-plain)">
      <div style={{ padding: '12px var(--pad) 0' }}>
        <h1 className="t-h1" style={{ margin: 0, color: 'var(--text)' }}>
          없는 주소입니다
        </h1>
        <p className="t-meta" style={{ margin: '10px 0 0', color: 'var(--text-3)' }}>
          주소가 바뀌었거나 앱에 없는 화면입니다
        </p>
        <div style={{ marginTop: 20 }}>
          <Link href="/" className="t-body tap-y">
            홈으로
          </Link>
        </div>
      </div>
    </Screen>
  );
}
