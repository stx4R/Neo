import type { Metadata, Viewport } from "next";
import { ServiceWorker } from "@/components/ServiceWorker";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEO",
  description: "해외 수출 규제 대응",
  // 매니페스트를 못 읽는 iOS에서 standalone으로 열리게 하는 통로.
  appleWebApp: {
    capable: true,
    title: "NEO",
    // 상태바를 배경(--bg) 위에 겹친다. Screen이 상단 --safe-top을 비워 두고 있다.
    statusBarStyle: "black-translucent",
  },
  // 매니페스트 아이콘과 달리 apple-touch-icon은 <link>로 따로 알려야 한다.
  icons: { apple: "/icons/apple-touch-icon-180.png" },
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
  themeColor: "#171717",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
