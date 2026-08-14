"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isProductSetupComplete } from "@/lib/repositories/productSetupRepository";

export function OnboardingGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [entered, setEntered] = useState(false);
  const [allowedPath, setAllowedPath] = useState<string | null>(null);
  const isSetupPath = pathname === "/setup";
  const isWelcomePath = pathname === "/welcome";

  useEffect(() => {
    const handleEnter = () => setEntered(true);
    window.addEventListener("vero-pos:enter", handleEnter);
    return () => window.removeEventListener("vero-pos:enter", handleEnter);
  }, []);

  useEffect(() => {
    let cancelled = false;

    isProductSetupComplete().then((setupCompleted) => {
      if (cancelled) return;

      if (isWelcomePath) {
        setAllowedPath(pathname);
      } else if (!entered) {
        router.replace("/welcome");
      } else if (!setupCompleted && !isSetupPath) {
        router.replace("/welcome");
      } else {
        setAllowedPath(pathname);
      }
    });

    return () => { cancelled = true; };
  }, [entered, isSetupPath, isWelcomePath, pathname, router]);

  return allowedPath === pathname ? children : null;
}
