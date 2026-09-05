import Link from 'next/link';
import { Screen } from '@/components/Screen';

/**
 * app/laws/[id]/page.tsx가 notFound()를 부르는데 받는 화면이 없어서
 * Next 기본 흰 화면이 떴다. 단일 다크 테마가 깨지는 실재하는 구멍이라 여기서 닫는다.
 *
 * 탭바를 두지 않는다 — 목록으로 돌아가는 길 하나만 있는 모달성 화면이다.
 */
export default function NotFound() {
  return (
    <Screen scrollPadBottom={0}>
      <div style={{ padding: '12px var(--pad) 0' }}>
        <h1 className="t-h1" style={{ margin: 0, color: 'var(--text)' }}>
          없는 법률입니다
        </h1>
        <p className="t-meta" style={{ margin: '10px 0 0', color: 'var(--text-3)' }}>
          주소가 바뀌었거나 목록에 없는 법령입니다
        </p>
        <div style={{ marginTop: 20 }}>
          <Link href="/laws" className="t-body">
            법률 목록으로
          </Link>
        </div>
      </div>
    </Screen>
  );
}
