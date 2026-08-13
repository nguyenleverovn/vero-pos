import { QuantityControl } from "@/components/QuantityControl";
import { CartItem as CartItemPayload } from "@/lib/cart/cart";

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
          type="button"
          onClick={() => onRemove(item.product.id)}
          aria-label={`Xoá ${item.product.name}`}
        >
          Xoá
        </button>
      </div>
    </li>
  );
}
