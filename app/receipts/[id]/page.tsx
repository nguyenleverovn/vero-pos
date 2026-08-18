"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatOrderCode, loadOrder, PosOrder } from "@/lib/repositories/orderRepository";
import styles from "../../checkout/print-receipt.module.css";

export default function ReceiptDetailPage() {
  const [order, setOrder] = useState<PosOrder | null | undefined>(undefined);

  useEffect(() => {
    const orderId = decodeURIComponent(window.location.pathname.split("/").pop() ?? "");
    loadOrder(orderId).then((savedOrder) => setOrder(savedOrder ?? null));
  }, []);

  if (order === undefined) return <main className="vp-screen vp-screen--plain" />;

  return (
    <>
    <main className={`vp-screen vp-screen--plain ${styles.screen}`}>
      <header className="vp-screen-heading vp-screen-heading--back">
        <Link className="vp-back" href="/receipts"><Image src="/icons/chevron-left.svg" alt="Quay lại" width={24} height={24} unoptimized /></Link>
        <h1>Chi tiết hóa đơn</h1>
        {order && <button className="vp-receipt-print-desktop" type="button" onClick={() => window.print()}>IN HÓA ĐƠN</button>}
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
          <div className="vp-receipt-detail-actions">
            <button className="vp-primary-button" type="button" onClick={() => window.print()}>IN HÓA ĐƠN</button>
          </div>
        </section>
      ) : <div className="vp-menu-empty">Không tìm thấy hóa đơn này.</div>}
    </main>
    {order && (
      <section className={`${styles.receipt} ${styles.printOnly}`} aria-label="Hóa đơn VERO POS">
        <header className={styles.header}>
          <h1>VERO POS</h1>
          <p>Mỗi Ngày Ít Nhất 100 ly nhé!</p>
        </header>
        <div className={styles.meta}>
          <p><span>Đơn:</span><strong>{formatOrderCode(order.orderNumber)}</strong></p>
          <p><span>Thời gian:</span><strong>{new Date(order.createdAt).toLocaleString("vi-VN")}</strong></p>
        </div>
        <div className={styles.items}>
          {order.items.map((item) => (
            <div className={styles.item} key={item.productId}>
              <p>{item.quantity}x {item.name}</p>
              <span>{(item.priceVnd * item.quantity).toLocaleString("vi-VN")}đ</span>
            </div>
          ))}
        </div>
        <div className={styles.total}>
          <span>TỔNG CỘNG</span>
          <strong>{order.totalVnd.toLocaleString("vi-VN")}đ</strong>
        </div>
        <p className={styles.payment}>Thanh toán: {order.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}</p>
        <footer className={styles.footer}>
          <strong>Cảm ơn anh chị và hẹn gặp lại!</strong>
          <span>Hotline: 028 6290 0001</span>
          <span>pos@verocoffeeshop.vn</span>
          <small>Powered by Vero SOL</small>
        </footer>
      </section>
    )}
    </>
  );
}
