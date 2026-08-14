"use client";

import { useEffect, useState } from "react";

export function WorkspaceMeta() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const date = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(now);
  const time = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(now);

  return (
    <div className="vp-workspace-meta" suppressHydrationWarning>
      <span>{date.charAt(0).toLocaleUpperCase("vi") + date.slice(1)}</span>
      <strong>{time}</strong>
    </div>
  );
}
