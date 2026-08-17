"use client";

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { formatOrderCode, loadOrders, PosOrder } from "@/lib/repositories/orderRepository";
import { clearPaymentQrCode, loadPaymentQrCode, savePaymentQrCode } from "@/lib/repositories/qrCodeRepository";
import { WorkspaceMeta } from "@/components/WorkspaceMeta";

function dateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function localDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function ReceiptsPage() {
  const [orders, setOrders] = useState<PosOrder[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const rangeValid = Boolean(rangeStart && rangeEnd && rangeStart <= rangeEnd);
  const filteredOrders = useMemo(() => {
    if (!rangeStart || !rangeEnd || !rangeValid) return rangeStart || rangeEnd ? [] : orders;
    const start = localDate(rangeStart);
    const end = localDate(rangeEnd);
    end.setDate(end.getDate() + 1);
    return orders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      return createdAt >= start && createdAt < end;
    });
  }, [orders, rangeEnd, rangeStart, rangeValid]);
  const summary = useMemo(() => ({
    orderCount: filteredOrders.length,
    estimatedRevenue: filteredOrders.reduce((sum, order) => sum + order.totalVnd, 0),
    cashCount: filteredOrders.filter((order) => order.paymentMethod === "cash").length,
    transferCount: filteredOrders.filter((order) => order.paymentMethod === "transfer").length
  }), [filteredOrders]);
  const ordersByDay = useMemo(() => {
    const groups = new Map<string, { label: string; orders: PosOrder[] }>();
    filteredOrders.forEach((order) => {
      const createdAt = new Date(order.createdAt);
      const key = dateInputValue(createdAt);
      const group = groups.get(key) ?? {
        label: createdAt.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }),
        orders: []
      };
      group.orders.push(order);
      groups.set(key, group);
    });
    return Array.from(groups.entries()).map(([key, value]) => ({ key, ...value }));
  }, [filteredOrders]);

  useEffect(() => {
    let cancelled = false;
    loadOrders().then((savedOrders) => {
      if (cancelled) return;
      setOrders(savedOrders);
      const today = dateInputValue(new Date());
      setRangeStart(today);
      setRangeEnd(today);
      setLoaded(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    loadPaymentQrCode().then(setQrCode);
  }, []);

  function handleQrChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const imageDataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!imageDataUrl) return;
      setQrCode(imageDataUrl);
      await savePaymentQrCode(imageDataUrl);
    };
    reader.readAsDataURL(file);
  }

  async function removeQrCode() {
    setQrCode("");
    await clearPaymentQrCode();
  }

  return (
    <main className="vp-screen vp-screen--plain">
      <header className="vp-screen-heading"><h1>Nhật ký Hóa đơn</h1><WorkspaceMeta /></header>
      <div className="vp-receipt-range">
        <label><span>Từ ngày</span><input type="date" value={rangeStart} max={rangeEnd || undefined} onChange={(event) => setRangeStart(event.target.value)} /></label>
        <label><span>Đến ngày</span><input type="date" value={rangeEnd} min={rangeStart || undefined} onChange={(event) => setRangeEnd(event.target.value)} /></label>
        <button type="button" onClick={() => { setRangeStart(""); setRangeEnd(""); }}>Xem tất cả</button>
      </div>
      {!rangeValid && (rangeStart || rangeEnd) && <p className="vp-receipt-range-error">Vui lòng chọn đủ khoảng thời gian hợp lệ.</p>}
      <section className="vp-stat-row">
        <div className="vp-stat"><span>Tổng đơn trong khoảng</span><strong>{summary.orderCount} đơn</strong></div>
        <div className="vp-stat vp-stat--red"><span>Doanh thu ước tính</span><strong>{summary.estimatedRevenue.toLocaleString("vi-VN")}đ</strong></div>
        <div className="vp-stat vp-stat--cash"><span>Bằng Tiền mặt</span><strong>{summary.cashCount} đơn</strong></div>
        <div className="vp-stat vp-stat--transfer"><span>Bằng Chuyển khoản</span><strong>{summary.transferCount} đơn</strong></div>
      </section>
      <section className="vp-qr-settings">
        <div className="vp-qr-settings-copy"><strong>QR chuyển khoản</strong><span>QR này sẽ hiện khi chọn thanh toán chuyển khoản.</span></div>
        {qrCode ? <Image src={qrCode} alt="QR chuyển khoản" width={82} height={82} unoptimized /> : <div className="vp-qr-empty">Chưa có QR</div>}
        <div className="vp-qr-actions">
          <label><input type="file" accept="image/*" onChange={handleQrChange} /><span>{qrCode ? "Đổi QR" : "Thêm QR"}</span></label>
          {qrCode && <button type="button" onClick={removeQrCode}>Xóa QR</button>}
        </div>
      </section>
      {ordersByDay.map((group) => (
        <section className="vp-receipt-day" key={group.key}>
          <h2>{group.label}</h2>
          <div className="vp-receipt-table-head" aria-hidden="true"><span>Mã đơn hàng</span><span>Thời gian</span><span>Số lượng món</span><span>Phương thức</span><span>Tổng tiền</span><span>Thao tác</span></div>
          <div className="vp-receipt-list">
            {group.orders.map((order) => (
              <Link className="vp-receipt-card" href={`/receipts/${encodeURIComponent(order.id)}`} key={order.id}>
                <div className="vp-receipt-top"><strong>{formatOrderCode(order.orderNumber)}</strong><span className="vp-receipt-time">{new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span><strong>{order.totalVnd.toLocaleString("vi-VN")} đ</strong></div>
                <div className="vp-receipt-bottom"><span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} món</span><span className={`vp-payment-badge ${order.paymentMethod === "transfer" ? "vp-payment-badge--transfer" : ""}`}>{order.paymentMethod === "transfer" ? "Chuyển khoản" : "Tiền mặt"}</span></div>
                <span className="vp-receipt-detail">Chi tiết</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
      {loaded && ordersByDay.length === 0 && <div className="vp-menu-empty">Không có hóa đơn trong khoảng đã chọn.</div>}
    </main>
  );
}
