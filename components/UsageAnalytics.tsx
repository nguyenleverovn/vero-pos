"use client";

import { useEffect } from "react";
import { flushUsageEvents, trackUsageEvent } from "@/lib/analytics/usageAnalytics";

const SESSION_OPEN_KEY = "vero-pos-app-open-tracked";

export function UsageAnalytics() {
  useEffect(() => {
    if (!window.sessionStorage.getItem(SESSION_OPEN_KEY)) {
      window.sessionStorage.setItem(SESSION_OPEN_KEY, "true");
      void trackUsageEvent("app_open");
    } else {
      void flushUsageEvents();
    }

    const handleOnline = () => void flushUsageEvents();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") void flushUsageEvents();
    };
    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}
