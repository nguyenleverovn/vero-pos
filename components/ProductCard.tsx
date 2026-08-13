import { Product } from "@/lib/data/catalog";
import { ProductPrice } from "@/components/ProductPrice";

type ProductCardProps = { product: Product; onAdd: (product: Product) => void };

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <button className="vp-product-card" type="button" onClick={() => onAdd(product)} aria-label={`Thêm ${product.name}`}>
      <h3>{product.name}</h3>
      <ProductPrice amount={product.priceVnd} />
    </button>
  );
}
