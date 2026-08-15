"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { isProductSetupComplete } from "@/lib/repositories/productSetupRepository";
import { trackUsageEvent } from "@/lib/analytics/usageAnalytics";

const ENTRY_SESSION_KEY = "vero-pos:entered";

export default function WelcomePage() {
  const [ready, setReady] = useState(false);
  const [setupCompleted, setSetupCompleted] = useState(false);

  useEffect(() => {
    isProductSetupComplete().then((completed) => {
      setSetupCompleted(completed);
      setReady(true);
    });
  }, []);

  function handleStart() {
    if (!ready) return;
    void trackUsageEvent("welcome_started");
    window.sessionStorage.setItem(ENTRY_SESSION_KEY, "1");
    window.dispatchEvent(new Event("vero-pos:enter"));
    window.location.assign(setupCompleted ? "/" : "/setup");
  }

  return (
    <main className="vp-welcome vp-onboarding">
      <section className="vp-welcome-content">
        <Image className="vp-welcome-logo" src="/icons/vero-pos-logo-full.png" alt="VERO POS - CHẠM LÀ CHẠY" width={1238} height={500} priority unoptimized />
        <button className="vp-primary-button vp-welcome-start" type="button" onClick={handleStart} disabled={!ready}>CHẠY</button>
        <p className="vp-welcome-purpose">“100 ly là mục tiêu, 1000 ly là mục đích”</p>
        <p className="vp-welcome-hotline">Hotline: 028 6290 0001</p>
      </section>
      <p className="vp-welcome-powered">Powered by <strong>Vero SOL</strong></p>
    </main>
  );
}
