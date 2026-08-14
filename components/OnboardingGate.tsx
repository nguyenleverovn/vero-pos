"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isProductSetupComplete } from "@/lib/repositories/productSetupRepository";

export function OnboardingGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [entered, setEntered] = useState(false);
  const [canRender, setCanRender] = useState(false);
  const isSetupPath = pathname === "/setup";
  const isWelcomePath = pathname === "/welcome";

  useEffect(() => {
    const handleEnter = () => setEntered(true);
    window.addEventListener("vero-pos:enter", handleEnter);
    return () => window.removeEventListener("vero-pos:enter", handleEnter);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setCanRender(false);

    isProductSetupComplete().then((setupCompleted) => {
      if (cancelled) return;

      if (isWelcomePath) {
        setCanRender(true);
      } else if (!entered) {
        router.replace("/welcome");
      } else if (!setupCompleted && !isSetupPath) {
        router.replace("/welcome");
      } else {
        setCanRender(true);
      }
    });

    return () => { cancelled = true; };
  }, [entered, isSetupPath, isWelcomePath, pathname, router]);

  return canRender ? children : null;
}
