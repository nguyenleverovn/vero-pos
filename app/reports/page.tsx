import { revenueSummary } from "@/lib/data/dashboard";

export default function ReportsPage() {
  return (
    <main className="vp-screen vp-screen--plain">
      <header className="vp-screen-heading"><h1>Báo cáo doanh thu</h1><span className="vp-payment-badge">Hôm nay</span></header>
      <section className="vp-hero-metric"><span>Doanh thu hôm nay</span><strong>{revenueSummary.revenue.toLocaleString("vi-VN")} đ</strong><small><b>+{revenueSummary.growth}%</b>&nbsp; so với hôm qua</small></section>
      <section className="vp-stat-row" style={{ marginTop: 12 }}>
        <div className="vp-stat" style={{ background: "white", border: "1px solid var(--vp-border)" }}><span>Số đơn hàng</span><strong>{revenueSummary.orderCount} đơn</strong></div>
        <div className="vp-stat" style={{ background: "white", border: "1px solid var(--vp-border)" }}><span>Trung bình đơn</span><strong>{revenueSummary.averageOrder.toLocaleString("vi-VN")} đ</strong></div>
      </section>
      <div className="vp-report-grid">
        <section><h2 className="vp-section-title">Doanh thu theo giờ</h2><div className="vp-chart-card">{revenueSummary.hourly.map((item) => <div className="vp-bar-item" key={item.hour}><span className="vp-bar" style={{ height: `${item.value}%` }} /><span>{item.hour}</span></div>)}</div></section>
        <section><h2 className="vp-section-title">Món bán chạy nhất</h2><div className="vp-ranking">{revenueSummary.topProducts.map((item, index) => <div className="vp-rank-item" key={item.name}><span className="vp-rank-number">{index + 1}</span><span className="vp-rank-name">{item.name}</span><span className="vp-rank-qty">{item.quantity} ly</span><span className="vp-rank-revenue">{item.revenue}</span></div>)}</div></section>
      </div>
    </main>
  );
}
