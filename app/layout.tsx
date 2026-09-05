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
    // 상태바를 배경(--bg) 위에 겹친다. Screen이 상단 44px을 비워 두고 있다.
    statusBarStyle: "black-translucent",
  },
  // 매니페스트 아이콘과 달리 apple-touch-icon은 <link>로 따로 알려야 한다.
  icons: { apple: "/icons/apple-touch-icon-180.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
