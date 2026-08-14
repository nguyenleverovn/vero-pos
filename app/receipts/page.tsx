"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatOrderCode, loadOrders, PosOrder } from "@/lib/repositories/orderRepository";

export default function ReceiptsPage() {
  const [orders, setOrders] = useState<PosOrder[]>([]);
  const [loaded, setLoaded] = useState(false);
  const summary = useMemo(() => ({
    orderCount: orders.length,
    estimatedRevenue: orders.reduce((sum, order) => sum + order.totalVnd, 0)
  }), [orders]);

  useEffect(() => {
    let cancelled = false;
    loadOrders().then((savedOrders) => {
      if (cancelled) return;
      setOrders(savedOrders);
      setLoaded(true);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="vp-screen vp-screen--plain">
      <header className="vp-screen-heading"><h1>Nhật ký Hóa đơn</h1><span className="vp-date-link">Hôm nay</span></header>
      <section className="vp-stat-row">
        <div className="vp-stat"><span>Tổng đơn hôm nay</span><strong>{summary.orderCount} đơn</strong></div>
        <div className="vp-stat vp-stat--red"><span>Doanh thu ước tính</span><strong>{summary.estimatedRevenue.toLocaleString("vi-VN")}đ</strong></div>
      </section>
      <section className="vp-receipt-list">
        {orders.map((order) => (
          <Link className="vp-receipt-card" href={`/receipts/${encodeURIComponent(order.id)}`} key={order.id}>
            <div className="vp-receipt-top"><strong>{formatOrderCode(order.orderNumber)}</strong><span className="vp-receipt-time">{new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span><strong>{order.totalVnd.toLocaleString("vi-VN")} đ</strong></div>
            <div className="vp-receipt-bottom"><span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} món</span><span className={`vp-payment-badge ${order.paymentMethod === "transfer" ? "vp-payment-badge--transfer" : ""}`}>{order.paymentMethod === "transfer" ? "Chuyển khoản" : "Tiền mặt"}</span></div>
          </Link>
        ))}
        {loaded && orders.length === 0 && <div className="vp-menu-empty">Chưa có hóa đơn nào.</div>}
      </section>
    </main>
  );
}
