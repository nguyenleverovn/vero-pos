import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="vp-welcome vp-onboarding">
      <section className="vp-welcome-content">
        <img className="vp-welcome-logo" src="/icons/vero-pos-logo.png" alt="VERO POS" />
        <div className="vp-welcome-line" />
        <p className="vp-welcome-slogan">Chạm là chạy</p>
        <Link className="vp-primary-button vp-welcome-start" href="/setup">Bắt đầu</Link>
      </section>
      <p className="vp-welcome-powered">Powered by <strong>Vero SOL</strong></p>
    </main>
  );
}
