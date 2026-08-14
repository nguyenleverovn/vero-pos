"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CartItem, clearCart, getCartTotal, loadCart } from "@/lib/cart/cart";
import { loadCatalog } from "@/lib/repositories/catalogRepository";
import { PaymentMethod, saveOrder } from "@/lib/repositories/orderRepository";
import { loadPaymentQrCode } from "@/lib/repositories/qrCodeRepository";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [isCompleting, setIsCompleting] = useState(false);
  const [qrCode, setQrCode] = useState("");
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
      await saveOrder(items, method);
      clearCart();
      router.replace("/");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <main className="vp-screen vp-screen--action">
      <header className="vp-screen-heading vp-screen-heading--back">
        <Link className="vp-back" href="/"><img src="/icons/chevron-left.svg" alt="Quay lại" /></Link>
        <h1>Thanh toán hóa đơn</h1>
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
              {qrCode ? <img src={qrCode} alt="QR chuyển khoản" /> : <p>Chưa có QR chuyển khoản. Thêm QR tại trang Hóa đơn.</p>}
            </div>
          )}
        </section>
      </div>
      <div className="vp-action-panel"><button className="vp-primary-button" type="button" disabled={!canComplete} onClick={completeCheckout}>{isCompleting ? "ĐANG LƯU ĐƠN..." : "HOÀN TẤT & IN BILL"}</button></div>
    </main>
  );
}
