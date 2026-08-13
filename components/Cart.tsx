import { useMemo } from "react";
import { CartItem, CartItemPayload } from "@/components/CartItem";

type CartProps = {
  items: CartItemPayload[];
  onUpdateItem: (payload: CartItemPayload) => void;
  onRemoveItem: (productId: string) => void;
  onClearAll: () => void;
};

export function Cart({ items, onUpdateItem, onRemoveItem, onClearAll }: CartProps) {
  const total = useMemo(() => items.reduce((sum, item) => sum + item.product.priceVnd * item.quantity, 0), [items]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const label = `${total.toLocaleString("vi-VN")} đ`;

  return (
    <>
      <section className="vp-cart-mobile" aria-label="Giỏ hàng">
        <div className="vp-cart-row">
          <span className="vp-cart-count"><span className="vp-cart-badge">{count}</span>Món đã chọn</span>
          <strong className="vp-cart-total">{label}</strong>
        </div>
        <a className="vp-primary-button" href="/checkout">THANH TOÁN ({Math.max(count, 1)} chạm)</a>
      </section>

      <aside className="vp-cart-desktop">
        <div className="vp-cart-row"><h2>Đơn hiện tại</h2><button className="vp-button vp-button--secondary" onClick={onClearAll}>Làm mới</button></div>
        <ul className="vp-cart-list">
          {items.map((item) => <CartItem key={item.product.id} item={item} onChange={onUpdateItem} onRemove={onRemoveItem} />)}
        </ul>
        <div className="vp-cart-row"><strong>Tổng cộng</strong><strong>{label}</strong></div>
        <a className="vp-primary-button" href="/checkout">THANH TOÁN</a>
      </aside>
    </>
  );
}
