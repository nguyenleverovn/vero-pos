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
        <img src="/icons/vero-pos-icon.png" alt="VERO POS" />
      </div>
      <nav className="vp-sidebar-nav" aria-label="Điều hướng desktop">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (pathname === "/checkout" && item.key === "pos") || (pathname === "/setup" && item.key === "menu");
          return <Link key={item.key} href={item.href} className={`vp-side-link ${active ? "is-active" : ""}`}><img src={item.icon} alt="" /><span>{item.label}</span></Link>;
        })}
      </nav>
    </aside>
  );
}
