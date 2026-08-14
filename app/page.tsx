"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CategoryId, PosCatalog, Product } from "@/lib/data/catalog";
import { CategoryTabs } from "@/components/CategoryTabs";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Cart } from "@/components/Cart";
import {
  addProduct,
  CartItem,
  changeQuantity,
  loadCart,
  removeProduct,
  saveCart
} from "@/lib/cart/cart";
import { loadCatalog } from "@/lib/repositories/catalogRepository";

export default function VeroPosPage() {
  const [catalog, setCatalog] = useState<PosCatalog | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCatalog().then((data) => {
      setCatalog(data);
      setItems(loadCart(data.products));
    });
  }, []);

  useEffect(() => {
    if (catalog) saveCart(items);
  }, [catalog, items]);

  if (!catalog) return <main className="vp-screen"><Header /></main>;

  const visibleProducts = activeCategory === "all"
    ? catalog.products.filter((product) => product.active)
    : catalog.products.filter((product) =>
        product.active && product.category === activeCategory);

  const addToCart = (product: Product) => setItems((current) => addProduct(current, product));
  const updateCartItem = (next: CartItem) => setItems((current) =>
    changeQuantity(current, next.product.id, next.quantity));

  return (
    <main className="vp-screen vp-screen--pos">
      <div className="vp-pos-main">
        <Header />
        <CategoryTabs activeCategory={activeCategory} items={catalog.categories} onChange={setActiveCategory} />
        <section className="vp-product-grid" aria-label="Sản phẩm">
          {visibleProducts.length > 0 ? visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={items.find((item) => item.product.id === product.id)?.quantity ?? 0}
              onAdd={addToCart}
            />
          )) : (
            <div className="vp-pos-empty">
              <strong>Danh mục này chưa có món</strong>
              <span>Thêm món đầu tiên để bắt đầu bán hàng.</span>
              <Link href="/setup">Thêm món mới</Link>
            </div>
          )}
        </section>
      </div>
      <Cart
        items={items}
        onUpdateItem={updateCartItem}
        onRemoveItem={(id) => setItems((current) => removeProduct(current, id))}
        onClearAll={() => setItems([])}
      />
    </main>
  );
}
