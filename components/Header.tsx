import Image from "next/image";
import { WorkspaceMeta } from "@/components/WorkspaceMeta";

export function Header() {
  return (
    <header className="vp-brand-header">
      <Image className="vp-brand-icon" src="/icons/vero-pos-icon.png" alt="VERO POS" width={38} height={38} unoptimized />
      <h1 className="vp-desktop-title">Bán hàng</h1>
      <WorkspaceMeta />
    </header>
  );
}
