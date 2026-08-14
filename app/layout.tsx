import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { BottomNav } from "@/components/BottomNav";
import { Sidebar } from "@/components/Sidebar";
import { OnboardingGate } from "@/components/OnboardingGate";

export const metadata: Metadata = {
  applicationName: "VERO POS",
  title: "VERO POS - Chạm là chạy",
  description: "Ứng dụng bán hàng dành cho quán cà phê",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VERO POS"
  },
  icons: {
    icon: "/icons/vero-pos-icon.png",
    apple: "/icons/vero-pos-icon.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf7f2"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <OnboardingGate>
          <div className="vp-app-frame">
            <Sidebar />
            <div className="vp-content">{children}</div>
          </div>
          <BottomNav />
        </OnboardingGate>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
