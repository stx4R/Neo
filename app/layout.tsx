import type { Metadata, Viewport } from "next";
import { AppHeight } from "@/components/AppHeight";
import { ProfileGate } from "@/components/ProfileGate";
import { ServiceWorker } from "@/components/ServiceWorker";
import { ThemeSync } from "@/components/ThemeToggle";
import { SCREEN_COLOR, THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEO",
  description: "해외 수출 규제 대응",
  // 매니페스트를 못 읽는 iOS에서 standalone으로 열리게 하는 통로.
  appleWebApp: {
    capable: true,
    title: "NEO",
    // 예전에는 "black-translucent"로 상태바를 앱 바탕 위에 겹쳤다. 그 모드의
    // 상태바 글자는 언제나 흰색이라, 라이트가 기준인 지금은 시계·배터리가 흰 바탕에
    // 묻힌다. "default"는 상태바를 웹뷰 바깥 위쪽에 따로 둔다 — 그만큼 --safe-top은 0이 된다.
    // 그 자리는 앱이 못 그리고 iOS가 theme-color로 칠하므로, 화면 바탕이 바뀔 때마다
    // 그 색을 따라가게 한다(lib/useTheme.ts의 paintScreenBg).
    statusBarStyle: "default",
  },
  // 매니페스트 아이콘과 달리 apple-touch-icon은 <link>로 따로 알려야 한다.
  icons: { apple: "/icons/apple-touch-icon-180.png" },
  // appleWebApp.capable은 Next 16에서 표준명 mobile-web-app-capable 하나만 낸다.
  // iOS Safari는 그 이름을 모른다 — apple- 접두 이름이 없으면 홈 화면 앱 설정을
  // 통째로 무시하고, 그러면 웹뷰가 화면 전체를 덮지 않아 env(safe-area-inset-*)이
  // 0으로 접힌다. 그 결과가 "탭바가 홈 인디케이터를 비켜 서지 않는" 증상이다.
  // 표준명은 Next가 이미 내보내므로 여기서는 애플 이름만 더한다.
  other: { "apple-mobile-web-app-capable": "yes" },
};

// maximumScale 1 · userScalable false는 접근성과 맞바꾼 값이다 — WCAG 1.4.4는
// 200% 확대를 요구한다. 앱처럼 다루라는 요구를 우선했고, 대신 본문을 15px 아래로
// 내리지 않아 확대 없이 읽히게 뒀다. iOS Safari는 이 둘을 무시하므로
// 실기기에서 핀치가 살아 있을 수 있다. DISCREPANCIES 수정 5 항목 참고.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // themeColor는 여기 두지 않는다 — 아래 <head>의 meta를 본다.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning — 아래 인라인 스크립트가 <html>에 data-theme을 먼저 단다.
    // React가 그 속성을 불일치로 보지 않게 한다. 이 요소 하나에만 걸리고 자식에는 번지지 않는다.
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/*
          브라우저 UI 색. 기본 테마(라이트)로 첫 화면(start_url = S1 홈)을 열었을 때의
          바탕이고, 테마와 화면이 바뀌면 인라인 스크립트와 lib/useTheme.ts가 이 meta를
          고친다. 기기 설정을 따르지 않으므로 미디어 쿼리로 나누지 않는다.

          Next의 viewport.themeColor로 두지 않는 이유: 화면을 옮길 때마다 Next가 옛 meta를
          걷어내고 SSR 값(라이트 캔버스)으로 새로 싣는다 — 다크로 /laws에 가면 앱이 칠한
          #151c24 옆에 #f2f5f7이 새로 붙었다(실측). 루트 레이아웃은 화면이 바뀌어도 다시
          그려지지 않으므로, 여기 직접 두면 meta 하나가 그대로 남는다.
        */}
        <meta name="theme-color" content={SCREEN_COLOR.light.canvas} />
        {/* 저장된 테마를 첫 페인트 전에 입힌다. 내용은 lib/theme.ts의 THEME_SCRIPT. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        {children}
        <AppHeight />
        <ProfileGate />
        <ServiceWorker />
        <ThemeSync />
      </body>
    </html>
  );
}
