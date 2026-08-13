import { Product } from "@/lib/data/catalog";
import { ProductPrice } from "@/components/ProductPrice";

type ProductCardProps = {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
};

export function ProductCard({ product, quantity, onAdd }: ProductCardProps) {
  return (
    <button className={`vp-product-card ${quantity > 0 ? "is-selected" : ""}`} type="button" onClick={() => onAdd(product)} aria-label={`Thêm ${product.name}`}>
      {quantity > 0 && <span className="vp-product-quantity" aria-label={`Đã chọn ${quantity}`}>{quantity}</span>}
      <h3>{product.name}</h3>
      <ProductPrice amount={product.priceVnd} />
    </button>
  );
}
