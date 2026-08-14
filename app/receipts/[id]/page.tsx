"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatOrderCode, loadOrder, PosOrder } from "@/lib/repositories/orderRepository";

export default function ReceiptDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<PosOrder | null | undefined>(undefined);

  useEffect(() => {
    loadOrder(decodeURIComponent(params.id)).then((savedOrder) => setOrder(savedOrder ?? null));
  }, [params.id]);

  if (order === undefined) return <main className="vp-screen vp-screen--plain" />;

  return (
    <main className="vp-screen vp-screen--plain">
      <header className="vp-screen-heading vp-screen-heading--back">
        <Link className="vp-back" href="/receipts"><img src="/icons/chevron-left.svg" alt="Quay lại" /></Link>
        <h1>Chi tiết hóa đơn</h1>
      </header>
      {order ? (
        <section className="vp-receipt-detail">
          <div className="vp-receipt-detail-heading">
            <div><span>Mã hóa đơn</span><strong>{formatOrderCode(order.orderNumber)}</strong></div>
            <div><span>Thời gian</span><strong>{new Date(order.createdAt).toLocaleString("vi-VN")}</strong></div>
          </div>
          <ul>
            {order.items.map((item) => (
              <li key={item.productId}>
                <div><strong>{item.name}</strong><span>{item.quantity} × {item.priceVnd.toLocaleString("vi-VN")}đ</span></div>
                <b>{(item.quantity * item.priceVnd).toLocaleString("vi-VN")}đ</b>
              </li>
            ))}
          </ul>
          <div className="vp-receipt-detail-total"><span>Tổng thanh toán</span><strong>{order.totalVnd.toLocaleString("vi-VN")}đ</strong></div>
          <div className="vp-receipt-detail-method"><span>Phương thức</span><b>{order.paymentMethod === "transfer" ? "Chuyển khoản" : "Tiền mặt"}</b></div>
        </section>
      ) : <div className="vp-menu-empty">Không tìm thấy hóa đơn này.</div>}
    </main>
  );
}
