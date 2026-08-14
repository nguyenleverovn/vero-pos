import { WorkspaceMeta } from "@/components/WorkspaceMeta";

export function Header() {
  return (
    <header className="vp-brand-header">
      <img className="vp-brand-icon" src="/icons/vero-pos-icon.png" alt="VERO POS" />
      <h1 className="vp-desktop-title">Bán hàng</h1>
      <WorkspaceMeta />
    </header>
  );
}
