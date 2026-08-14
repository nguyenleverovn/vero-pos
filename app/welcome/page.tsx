"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isProductSetupComplete } from "@/lib/repositories/productSetupRepository";

export default function WelcomePage() {
  const router = useRouter();
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
    window.dispatchEvent(new Event("vero-pos:enter"));
    router.push(setupCompleted ? "/" : "/setup");
  }

  return (
    <main className="vp-welcome vp-onboarding">
      <section className="vp-welcome-content">
        <img className="vp-welcome-logo" src="/icons/vero-pos-logo-full.png" alt="VERO POS - CHẠM LÀ CHẠY" />
        <button className="vp-primary-button vp-welcome-start" type="button" onClick={handleStart} disabled={!ready}>CHẠY</button>
        <p className="vp-welcome-purpose">“100 ly là mục tiêu, 1000 ly là mục đích”</p>
        <p className="vp-welcome-hotline">Hotline: 028 6290 0001</p>
      </section>
      <p className="vp-welcome-powered">Powered by <strong>Vero SOL</strong></p>
    </main>
  );
}
