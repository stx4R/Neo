'use client';

import { Button } from '@/components/Button';
import { dismissInstall, showInstallPrompt } from '@/lib/useInstallPrompt';

/**
 * 설치 카드. 디자인 원본에 없는 화면이라 새 어법을 만들지 않고 떠 있는 탭바와
 * 같은 문법(elevated 면 + 1px 선 + shadow-2)으로 탭바 바로 위에 띄운다.
 *
 * 브랜드 색면 카드로 만들지 않는다 — S6의 "시행일 알림 받기"와 위계가 부딪친다.
 * 저쪽은 놓치면 손해를 보는 것이고, 이건 있으면 편한 것이다.
 *
 * 보일지 말지는 호출부가 판단한다 — scrollPadBottom을 같이 밀어야 하므로
 * 판단이 두 곳에 있으면 어긋난다. INSTALL_BANNER_H는 카드 높이 + 탭바와의 간격이다.
 */
const CARD_H = 72;
const GAP = 8;
export const INSTALL_BANNER_H = CARD_H + GAP;

export function InstallBanner() {
  return (
    <div
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: `calc(var(--float-bottom) + var(--tabbar-h) + ${GAP}px)`,
        height: CARD_H,
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 12px 0 18px',
        borderRadius: 'var(--r-card)',
        background: 'var(--tds-bg-elevated)',
        border: '1px solid var(--tds-line-default)',
        boxShadow: 'var(--shadow-2)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="t-body-b">홈 화면에 추가</span>
        <span className="t-small one-line" style={{ color: 'var(--tds-fg-tertiary)' }}>
          오프라인에서도 바로 열 수 있어요
        </span>
      </div>
      <Button variant="ghost" size="s" onClick={dismissInstall}>
        나중에
      </Button>
      <Button size="s" onClick={showInstallPrompt}>
        설치
      </Button>
    </div>
  );
}
