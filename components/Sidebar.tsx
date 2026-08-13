"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isOnboardingPath, NAV_ITEMS } from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();
  if (isOnboardingPath(pathname)) return null;

  return (
    <aside className="vp-sidebar">
      <div className="vp-sidebar-brand">
        <img src="/icons/vero-pos-logo.png" alt="" />
        <div><strong>VERO SOL</strong><span>Khai thông bế tắc</span></div>
      </div>
      <nav className="vp-sidebar-nav" aria-label="Điều hướng desktop">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (pathname === "/checkout" && item.key === "pos");
          return <Link key={item.key} href={item.href} className={`vp-side-link ${active ? "is-active" : ""}`}><img src={item.icon} alt="" /><span>{item.label}</span></Link>;
        })}
      </nav>
      <div className="vp-cashier"><strong>Quầy số 1</strong><span>Thu ngân chính</span></div>
    </aside>
  );
}
