"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isProductSetupComplete } from "@/lib/onboarding/productSetup";

export function OnboardingGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [completed, setCompleted] = useState<boolean | null>(null);
  const isSetupPath = pathname === "/setup";
  const isWelcomePath = pathname === "/welcome";

  useEffect(() => {
    const setupCompleted = isProductSetupComplete();
    setCompleted(setupCompleted);

    if (!setupCompleted && !isSetupPath && !isWelcomePath) {
      router.replace("/welcome");
    } else if (setupCompleted && isWelcomePath) {
      router.replace("/");
    }
  }, [isSetupPath, isWelcomePath, pathname, router]);

  if (completed === null) return null;
  if (!completed && !isSetupPath && !isWelcomePath) return null;
  if (completed && isWelcomePath) return null;

  return children;
}
