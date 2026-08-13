import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="vp-welcome vp-onboarding">
      <section className="vp-welcome-content" aria-labelledby="welcome-title">
        <div className="vp-welcome-brand" aria-label="VERO POS">
          <img src="/icons/vero-pos-mark.png" alt="" />
          <span>VERO POS</span>
        </div>
        <p className="vp-welcome-slogan">Chạm là chạy</p>
        <h1 id="welcome-title">Giải pháp bán hàng đơn giản<br />cho quán cà phê</h1>
        <Link className="vp-primary-button vp-welcome-start" href="/setup">Bắt đầu</Link>
      </section>
    </main>
  );
}
