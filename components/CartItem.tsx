import { Product } from "@/lib/data/catalog";
import { QuantityControl } from "@/components/QuantityControl";

export type CartItemPayload = {
  product: Product;
  quantity: number;
};

type CartItemProps = {
  item: CartItemPayload;
  onChange: (payload: CartItemPayload) => void;
  onRemove: (productId: string) => void;
};

export function CartItem({ item, onChange, onRemove }: CartItemProps) {
  return (
    <li className="vp-cart-item">
      <div>
        <p className="vp-body-bold">{item.product.name}</p>
        <p className="vp-caption">₫ {item.product.priceVnd.toLocaleString("vi-VN")}</p>
      </div>
      <div className="vp-qty-wrap">
        <QuantityControl
          quantity={item.quantity}
          onDecrease={() =>
            onChange({
              ...item,
              quantity: Math.max(item.quantity - 1, 0)
            })
          }
          onIncrease={() => onChange({ ...item, quantity: item.quantity + 1 })}
        />
        <button
          className="vp-link-danger"
          onClick={() => onRemove(item.product.id)}
          aria-label={`Xoá ${item.product.name}`}
        >
          Xoá
        </button>
      </div>
    </li>
  );
}
