import { receiptSummary, receipts } from "@/lib/data/dashboard";

export default function ReceiptsPage() {
  return (
    <main className="vp-screen vp-screen--plain">
      <header className="vp-screen-heading"><h1>Nhật ký Hóa đơn</h1><span className="vp-date-link">Hôm nay</span></header>
      <section className="vp-stat-row">
        <div className="vp-stat"><span>Tổng đơn hôm nay</span><strong>{receiptSummary.orderCount} đơn</strong></div>
        <div className="vp-stat vp-stat--red"><span>Doanh thu ước tính</span><strong>{receiptSummary.estimatedRevenue.toLocaleString("vi-VN")}đ</strong></div>
      </section>
      <section className="vp-receipt-list">
        {receipts.map((receipt) => (
          <article className="vp-receipt-card" key={receipt.id}>
            <div className="vp-receipt-top"><strong>#{receipt.id}</strong><span className="vp-receipt-time">{receipt.time}</span><strong>{receipt.total.toLocaleString("vi-VN")} đ</strong></div>
            <div className="vp-receipt-bottom"><span>{receipt.items} món</span><span className={`vp-payment-badge ${receipt.method === "Chuyển khoản" ? "vp-payment-badge--transfer" : ""}`}>{receipt.method}</span></div>
          </article>
        ))}
      </section>
    </main>
  );
}
