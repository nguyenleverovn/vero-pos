"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isProductSetupComplete } from "@/lib/repositories/productSetupRepository";

export function OnboardingGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [completed, setCompleted] = useState<boolean | null>(null);
  const isSetupPath = pathname === "/setup";
  const isWelcomePath = pathname === "/welcome";

  useEffect(() => {
    let cancelled = false;

    isProductSetupComplete().then((setupCompleted) => {
      if (cancelled) return;
      setCompleted(setupCompleted);

      if (!setupCompleted && !isSetupPath && !isWelcomePath) {
        router.replace("/welcome");
      } else if (setupCompleted && isWelcomePath) {
        router.replace("/");
      }
    });

    return () => { cancelled = true; };
  }, [isSetupPath, isWelcomePath, pathname, router]);

  if (completed === null) return null;
  if (!completed && !isSetupPath && !isWelcomePath) return null;
  if (completed && isWelcomePath) return null;

  return children;
}
