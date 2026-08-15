"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { CartItem, clearCart, getCartTotal, loadCart } from "@/lib/cart/cart";
import { loadCatalog } from "@/lib/repositories/catalogRepository";
import { formatOrderCode, PaymentMethod, PosOrder, saveOrder } from "@/lib/repositories/orderRepository";
import { loadPaymentQrCode } from "@/lib/repositories/qrCodeRepository";
import { WorkspaceMeta } from "@/components/WorkspaceMeta";
import { trackUsageEvent } from "@/lib/analytics/usageAnalytics";
import styles from "./print-receipt.module.css";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [isCompleting, setIsCompleting] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [receipt, setReceipt] = useState<PosOrder | null>(null);
  const due = getCartTotal(items);
  const canComplete = due > 0 && !isCompleting;

  useEffect(() => {
    loadCatalog().then((catalog) => {
      const savedItems = loadCart(catalog.products);
      setItems(savedItems);
    });
  }, []);

  useEffect(() => {
    loadPaymentQrCode().then(setQrCode);
  }, []);

  const completeCheckout = async () => {
    if (!canComplete) return;
    setIsCompleting(true);

    try {
      const order = await saveOrder(items, method);
      flushSync(() => setReceipt(order));
      void trackUsageEvent("order_completed");
    } finally {
      setIsCompleting(false);
    }
  };

  const finishCheckout = () => {
    clearCart();
    router.replace("/");
  };

  const printReceipt = () => {
    window.addEventListener("afterprint", finishCheckout, { once: true });
    window.print();
  };

  return (
    <>
    <main className={`vp-screen vp-screen--action ${receipt ? styles.screenHidden : ""}`}>
      <header className="vp-screen-heading vp-screen-heading--back">
        <Link className="vp-back" href="/"><Image src="/icons/chevron-left.svg" alt="Quay lại" width={24} height={24} unoptimized /></Link>
        <h1>Thanh toán hóa đơn</h1>
        <WorkspaceMeta />
      </header>
      <div className="vp-payment-layout">
        <section className="vp-payment-summary">
          <div className="vp-payment-due"><span>Cần thanh toán</span><strong>{due.toLocaleString("vi-VN")}đ</strong></div>
          <p className="vp-payment-item-count">{items.reduce((sum, item) => sum + item.quantity, 0)} món trong đơn</p>
          <div className="vp-methods">
            <button className={`vp-method ${method === "cash" ? "is-active" : ""}`} onClick={() => setMethod("cash")}>Tiền mặt</button>
            <button className={`vp-method ${method === "transfer" ? "is-active" : ""}`} onClick={() => setMethod("transfer")}>Chuyển khoản (QR)</button>
          </div>
          {method === "transfer" && (
            <div className="vp-checkout-qr">
              {qrCode ? <Image src={qrCode} alt="QR chuyển khoản" width={240} height={240} unoptimized /> : <p>Chưa có QR chuyển khoản. Thêm QR tại trang Hóa đơn.</p>}
            </div>
          )}
          <button className="vp-primary-button vp-checkout-desktop-action" type="button" disabled={!canComplete} onClick={completeCheckout}>{isCompleting ? "ĐANG LƯU ĐƠN..." : "HOÀN TẤT & IN BILL"}</button>
        </section>
        <aside className="vp-checkout-order-summary">
          <h2>Tóm tắt đơn hàng</h2>
          <ul>{items.map((item) => <li key={item.product.id}><span>{item.quantity}x {item.product.name}</span><strong>{(item.product.priceVnd * item.quantity).toLocaleString("vi-VN")}đ</strong></li>)}</ul>
          <div><span>Tiền hàng</span><strong>{due.toLocaleString("vi-VN")}đ</strong></div>
          <div><span>Thuế VAT (0%)</span><strong>0đ</strong></div>
          <div className="vp-checkout-total"><span>Thanh toán</span><strong>{due.toLocaleString("vi-VN")}đ</strong></div>
        </aside>
      </div>
      <div className="vp-action-panel"><button className="vp-primary-button" type="button" disabled={!canComplete} onClick={completeCheckout}>{isCompleting ? "ĐANG LƯU ĐƠN..." : "HOÀN TẤT & IN BILL"}</button></div>
    </main>
    {receipt && (
      <section className={styles.receipt} aria-label="Hóa đơn VERO POS">
        <header className={styles.header}>
          <h1>VERO POS</h1>
          <p>Mỗi Ngày Ít Nhất 100 ly nhé!</p>
        </header>
        <div className={styles.meta}>
          <p><span>Đơn:</span><strong>{formatOrderCode(receipt.orderNumber)}</strong></p>
          <p><span>Thời gian:</span><strong>{new Date(receipt.createdAt).toLocaleString("vi-VN")}</strong></p>
        </div>
        <div className={styles.items}>
          {receipt.items.map((item) => (
            <div className={styles.item} key={item.productId}>
              <p>{item.quantity}x {item.name}</p>
              <span>{(item.priceVnd * item.quantity).toLocaleString("vi-VN")}đ</span>
            </div>
          ))}
        </div>
        <div className={styles.total}>
          <span>TỔNG CỘNG</span>
          <strong>{receipt.totalVnd.toLocaleString("vi-VN")}đ</strong>
        </div>
        <p className={styles.payment}>Thanh toán: {receipt.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}</p>
        <footer className={styles.footer}>
          <strong>Cảm ơn anh chị và hẹn gặp lại!</strong>
          <span>Hotline: 028 6290 0001</span>
          <span>pos@verocoffeeshop.vn</span>
          <small>Powered by Vero SOL</small>
        </footer>
        <div className={styles.actions}>
          <button type="button" onClick={printReceipt}>IN HÓA ĐƠN</button>
          <button type="button" onClick={finishCheckout}>BỎ QUA IN</button>
        </div>
      </section>
    )}
    </>
  );
}
