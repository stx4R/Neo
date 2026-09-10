import type { Metadata, Viewport } from "next";
import { ProfileGate } from "@/components/ProfileGate";
import { ServiceWorker } from "@/components/ServiceWorker";
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
  // 브라우저 UI 색. 화면 바탕(--tds-bg-canvas)과 같은 값이다 — CSS 변수를 못 쓰는
  // 자리라 리터럴이다. 라이트 oklch(0.968 0.004 247), 다크 oklch(0.185 0.019 254).
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0d131b" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>
        {children}
        <ProfileGate />
        <ServiceWorker />
      </body>
    </html>
  );
}
