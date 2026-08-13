"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CartItem, getCartTotal, loadCart } from "@/lib/cart/cart";
import { loadCatalog } from "@/lib/repositories/catalogRepository";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "back"];

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [method, setMethod] = useState<"cash" | "transfer">("cash");
  const [cash, setCash] = useState("");
  const due = getCartTotal(items);
  const cashValue = Number(cash || 0);
  const canComplete = due > 0 && (method === "transfer" || cashValue >= due);
  const suggestions = useMemo(() => {
    if (!due) return [];
    return Array.from(new Set([
      due,
      Math.ceil(due / 50000) * 50000,
      Math.ceil(due / 100000) * 100000,
      Math.ceil(due / 500000) * 500000
    ]));
  }, [due]);

  useEffect(() => {
    loadCatalog().then((catalog) => {
      const savedItems = loadCart(catalog.products);
      setItems(savedItems);
      setCash(String(getCartTotal(savedItems)));
    });
  }, []);

  const pressKey = (key: string) => setCash((current) => key === "back" ? current.slice(0, -1) : `${current}${key}`.replace(/^0+/, ""));

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
          <div className="vp-change-box">
            <div className="vp-change-line"><span>Khách đưa:</span><strong>{cashValue.toLocaleString("vi-VN")}đ</strong></div>
            <div className="vp-change-line"><span>Tiền thừa:</span><strong className={cashValue >= due ? "is-positive" : ""}>{Math.max(cashValue - due, 0).toLocaleString("vi-VN")}đ</strong></div>
          </div>
        </section>
        <section className="vp-keypad" aria-label="Bàn phím nhập tiền">
          <div className="vp-suggestions">{suggestions.map((value) => <button className="vp-suggestion" key={value} onClick={() => setCash(String(value))}>{value / 1000}k</button>)}</div>
          <div className="vp-key-grid">{keys.map((key) => <button className="vp-key" key={key} onClick={() => pressKey(key)}>{key === "back" ? "⌫" : key}</button>)}</div>
        </section>
      </div>
      <div className="vp-action-panel"><button className="vp-primary-button" type="button" disabled={!canComplete}>HOÀN TẤT &amp; IN BILL (1 chạm)</button></div>
    </main>
  );
}
