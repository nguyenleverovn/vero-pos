"use client";

import { useEffect, useMemo, useState } from "react";
import { V1DataTools } from "@/components/V1DataTools";
import { loadOrders, PosOrder } from "@/lib/repositories/orderRepository";
import { summarizeOrders, SummaryPeriod } from "@/lib/reports/orderSummary";
import { WorkspaceMeta } from "@/components/WorkspaceMeta";

const PERIODS: Array<{ id: SummaryPeriod; label: string }> = [
  { id: "day", label: "Ngày" },
  { id: "month", label: "Tháng" },
  { id: "year", label: "Năm" }
];

export default function ReportsPage() {
  const [orders, setOrders] = useState<PosOrder[]>([]);
  const [period, setPeriod] = useState<SummaryPeriod>("day");
  const [loaded, setLoaded] = useState(false);
  const summary = useMemo(() => summarizeOrders(orders, period), [orders, period]);

  useEffect(() => {
    let cancelled = false;
    loadOrders().then((savedOrders) => {
      if (!cancelled) {
        setOrders(savedOrders);
        setLoaded(true);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="vp-screen vp-screen--plain">
      <header className="vp-screen-heading"><h1>Báo cáo Doanh thu</h1><WorkspaceMeta /></header>
      <div className="vp-period-tabs" role="tablist" aria-label="Kỳ tổng kết">
        {PERIODS.map((item) => <button key={item.id} role="tab" aria-selected={period === item.id} className={period === item.id ? "is-active" : ""} onClick={() => setPeriod(item.id)}>{item.label}</button>)}
      </div>
      <section className="vp-report-kpis">
        <div className="vp-hero-metric"><span>Doanh thu {period === "day" ? "hôm nay" : period === "month" ? "tháng này" : "năm nay"}</span><strong>{summary.revenue.toLocaleString("vi-VN")} đ</strong><small>{summary.growthPercent === null ? "Chưa có dữ liệu kỳ trước" : <><b>{summary.growthPercent >= 0 ? "+" : ""}{summary.growthPercent}%</b>&nbsp; so với kỳ trước</>}</small></div>
        <div className="vp-stat vp-stat--white"><span>Số đơn hàng</span><strong>{summary.orderCount} đơn</strong></div>
        <div className="vp-stat vp-stat--white"><span>Trung bình đơn</span><strong>{summary.averageOrder.toLocaleString("vi-VN")} đ</strong></div>
      </section>
      {!loaded ? <div className="vp-menu-empty">Đang tải dữ liệu bán hàng...</div> : (
        <div className="vp-report-grid">
          <section><h2 className="vp-section-title">Doanh thu theo {period === "day" ? "giờ" : period === "month" ? "ngày" : "tháng"}</h2><div className="vp-chart-card">{summary.timeline.map((item) => <div className="vp-bar-item" key={item.label} title={`${item.revenue.toLocaleString("vi-VN")}đ`}><span className="vp-bar" style={{ height: `${item.height}%` }} /><span>{item.label}</span></div>)}</div></section>
          <section><h2 className="vp-section-title">Món bán chạy nhất</h2><div className="vp-ranking">{summary.topProducts.length > 0 ? summary.topProducts.map((item, index) => <div className="vp-rank-item" key={item.name}><span className="vp-rank-number">{index + 1}</span><span className="vp-rank-name">{item.name}</span><span className="vp-rank-qty">{item.quantity} ly</span><span className="vp-rank-revenue">{item.revenue.toLocaleString("vi-VN")}đ</span></div>) : <div className="vp-menu-empty">Chưa có đơn trong kỳ này.</div>}</div></section>
        </div>
      )}
      <V1DataTools />
    </main>
  );
}
