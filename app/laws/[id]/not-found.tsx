import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';

/**
 * 법령 상세의 404. `app/laws/[id]/page.tsx`의 `notFound()`가 여기로 온다.
 *
 * 전역 `app/not-found.tsx`와 나눈 이유: 전역이 "없는 법률"이라고 말하고 있었는데
 * `/no-such-page` 같은 법령이 아닌 주소에서도 그 문구가 떴다(4차 B8 실측).
 * 법령 id가 틀린 것과 주소 자체가 없는 것은 다른 일이고, 돌아갈 곳도 다르다.
 *
 * 탭바를 두지 않는다 — 목록으로 돌아가는 길 하나만 있는 모달성 화면이다.
 */
export default function LawNotFound() {
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
        <h1 className="t-h1">없는 법률이에요</h1>
        <p className="t-body" style={{ color: 'var(--tds-fg-tertiary)' }}>
          주소가 바뀌었거나 목록에 없는 법령이에요
        </p>
        <Button variant="ghost" href="/laws" style={{ alignSelf: 'flex-start', marginLeft: -16 }}>
          규제 목록으로
        </Button>
      </div>
    </Screen>
  );
}
