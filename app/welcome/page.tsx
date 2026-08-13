import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="vp-welcome">
      <img className="vp-welcome-logo" src="/icons/vero-pos-logo.png" alt="VERO POS" />
      <div className="vp-welcome-line" />
      <p className="vp-welcome-slogan">CHẠM LÀ CHẠY</p>
      <Link className="vp-primary-button" href="/">BẮT ĐẦU</Link>
    </main>
  );
}
