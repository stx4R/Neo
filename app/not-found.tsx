import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';

/**
 * 앱이 모르는 주소를 받는 화면. Next 기본 화면이 뜨면 앱의 테마가 깨진다.
 *
 * 법령 id가 틀린 경우는 `app/laws/[id]/not-found.tsx`가 따로 받는다 —
 * 여기서 "없는 법률"이라고 말하면 법령이 아닌 주소에서 거짓말이 된다(4차 B8).
 *
 * 탭바를 두지 않는다 — 돌아가는 길 하나만 있는 모달성 화면이다.
 */
export default function NotFound() {
  return (
    <Screen scrollPadBottom="var(--pad-plain)">
      <div
        style={{
          padding: 'calc(var(--topbar) + 8px) var(--pad) 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <h1 className="t-h1">없는 주소예요</h1>
        <p className="t-body" style={{ color: 'var(--tds-fg-tertiary)' }}>
          주소가 바뀌었거나 앱에 없는 화면이에요
        </p>
        <Button variant="ghost" href="/" style={{ alignSelf: 'flex-start', marginLeft: -16 }}>
          홈으로
        </Button>
      </div>
    </Screen>
  );
}
