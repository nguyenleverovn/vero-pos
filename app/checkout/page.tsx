"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CartItem, getCartTotal, loadCart } from "@/lib/cart/cart";
import { loadCatalog } from "@/lib/repositories/catalogRepository";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [method, setMethod] = useState<"cash" | "transfer">("cash");
  const due = getCartTotal(items);
  const canComplete = due > 0;

  useEffect(() => {
    loadCatalog().then((catalog) => {
      const savedItems = loadCart(catalog.products);
      setItems(savedItems);
    });
  }, []);

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
        </section>
      </div>
      <div className="vp-action-panel"><button className="vp-primary-button" type="button" disabled={!canComplete}>HOÀN TẤT &amp; IN BILL (1 chạm)</button></div>
    </main>
  );
}
