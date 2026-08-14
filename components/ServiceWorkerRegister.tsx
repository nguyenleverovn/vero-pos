"use client";

import { useEffect } from "react";
import { setInstallPrompt, VeroInstallPrompt } from "@/lib/pwa/installPrompt";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    const captureInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as VeroInstallPrompt);
    };
    const clearInstallPrompt = () => setInstallPrompt(null);
    const openCachedPageOffline = (event: MouseEvent) => {
      if (navigator.onLine || event.defaultPrevented || event.button !== 0) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      window.location.href = url.href;
    };
    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    window.addEventListener("appinstalled", clearInstallPrompt);
    document.addEventListener("click", openCachedPageOffline);

    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return () => {
        window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
        window.removeEventListener("appinstalled", clearInstallPrompt);
        document.removeEventListener("click", openCachedPageOffline);
      };
    }

    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker.getRegistrations().then((registrations) =>
        Promise.all(registrations.map((registration) => registration.unregister()))
      );
      if ("caches" in window) {
        void caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
      }
      return () => {
        window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
        window.removeEventListener("appinstalled", clearInstallPrompt);
        document.removeEventListener("click", openCachedPageOffline);
      };
    }

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        await registration.update();
      } catch {}
    };

    void register();

    return () => {
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
      window.removeEventListener("appinstalled", clearInstallPrompt);
      document.removeEventListener("click", openCachedPageOffline);
    };
  }, []);

  return null;
}
