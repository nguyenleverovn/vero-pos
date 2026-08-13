"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";

export function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/welcome") return null;

  return (
    <nav className="vp-bottom-nav" aria-label="Điều hướng chính">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || (pathname === "/checkout" && item.key === "pos");
        return (
          <Link key={item.key} href={item.href} className={`vp-bottom-item ${active ? "is-active" : ""}`}>
            <span className="vp-bottom-icon"><img src={item.icon} alt="" /></span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
