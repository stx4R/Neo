'use client';

import { dismissInstall, showInstallPrompt } from '@/lib/useInstallPrompt';

/**
 * 설치 배너. 아트보드에 없는 화면이라 새 어법을 만들지 않고 기존 행 문법으로 짠다.
 *
 * 색면으로 만들지 않는다 — S6의 시안 색면("시행일 알림 켜기")과 위계가 부딪친다.
 * 저 블록은 사용자가 놓치면 손해를 보는 것이고, 이건 있으면 편한 것이다.
 *
 * 탭바(z-index 5) 바로 아래에 앉는다. 탭바의 상단 하나선이 위에 그려져
 * 배너와 탭을 가른다.
 *
 * 보일지 말지는 호출부가 판단한다 — scrollPadBottom을 같이 밀어야 하므로
 * 판단이 두 곳에 있으면 어긋난다.
 */
export const INSTALL_BANNER_H = 64;

export function InstallBanner() {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        // 탭바 높이(64 + 하단 인디케이터 34)만큼 띄운다.
        bottom: 98,
        height: INSTALL_BANNER_H,
        zIndex: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--row-gap)',
        padding: '0 var(--pad)',
        background: 'var(--surface)',
        borderTop: '1px solid var(--hairline)',
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--stack)',
        }}
      >
        <span className="t-body" style={{ color: 'var(--text)' }}>
          홈 화면에 추가
        </span>
        <span className="t-meta" style={{ color: 'var(--text-3)' }}>
          오프라인에서도 열립니다
        </span>
      </div>

      <button
        type="button"
        className="t-body"
        onClick={showInstallPrompt}
        style={{
          flex: 'none',
          padding: 0,
          border: 'none',
          background: 'transparent',
          color: 'var(--accent)',
          textDecoration: 'underline',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        설치
      </button>
      <button
        type="button"
        className="t-meta"
        onClick={dismissInstall}
        style={{
          flex: 'none',
          padding: 0,
          border: 'none',
          background: 'transparent',
          color: 'var(--text-3)',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        나중에
      </button>
    </div>
  );
}
