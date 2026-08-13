"use client";

import { useEffect, useState } from "react";
import { CategoryId, PosCatalog, Product } from "@/lib/data/catalog";
import { CartItemPayload } from "@/components/CartItem";
import { CategoryTabs } from "@/components/CategoryTabs";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Cart } from "@/components/Cart";
import { loadCatalog } from "@/lib/repositories/catalogRepository";

export default function VeroPosPage() {
  const [catalog, setCatalog] = useState<PosCatalog | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("coffee");
  const [items, setItems] = useState<CartItemPayload[]>([]);

  useEffect(() => {
    loadCatalog().then((data) => {
      setCatalog(data);
      const selected = ["espresso", "latte", "tra-dao"].map((id) => data.products.find((product) => product.id === id)).filter(Boolean) as Product[];
      setItems(selected.map((product) => ({ product, quantity: 1 })));
    });
  }, []);

  if (!catalog) return <main className="vp-screen"><Header /></main>;

  const visibleProducts = activeCategory === "coffee"
    ? catalog.products.slice(0, 10)
    : catalog.products.filter((product) => product.category === activeCategory);

  const addToCart = (product: Product) => setItems((current) => {
    const existing = current.find((line) => line.product.id === product.id);
    return existing
      ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
      : [...current, { product, quantity: 1 }];
  });

  const updateCartItem = (next: CartItemPayload) => setItems((current) => next.quantity <= 0
    ? current.filter((item) => item.product.id !== next.product.id)
    : current.map((item) => item.product.id === next.product.id ? next : item));

  return (
    <main className="vp-screen vp-screen--pos">
      <div className="vp-pos-main">
        <Header />
        <CategoryTabs activeCategory={activeCategory} items={catalog.categories} onChange={setActiveCategory} />
        <section className="vp-product-grid" aria-label="Sản phẩm">
          {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}
        </section>
      </div>
      <Cart items={items} onUpdateItem={updateCartItem} onRemoveItem={(id) => setItems((current) => current.filter((item) => item.product.id !== id))} onClearAll={() => setItems([])} />
    </main>
  );
}
