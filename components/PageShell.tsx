import { ReactNode } from "react";

type PageShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <main className="veropos-shell">
      <section className="vp-panel">
        <p className="vp-label">VERO POS</p>
        <p className="vp-grid-title vp-title">{title}</p>
        {subtitle ? <p className="vp-caption">{subtitle}</p> : null}
      </section>
      <section className="vp-panel">{children}</section>
    </main>
  );
}
