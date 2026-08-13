import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="vp-welcome vp-onboarding">
      <section className="vp-welcome-content">
        <img className="vp-welcome-logo" src="/icons/vero-pos-logo.png" alt="VERO POS" />
        <p className="vp-welcome-slogan">CHẠM LÀ CHẠY</p>
        <Link className="vp-primary-button vp-welcome-start" href="/setup">CHẠY</Link>
        <p className="vp-welcome-purpose">“100 ly là mục tiêu, 1000 ly là mục đích”</p>
      </section>
      <p className="vp-welcome-powered">Powered by <strong>Vero SOL</strong></p>
    </main>
  );
}
