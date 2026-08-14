"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PosCatalog } from "@/lib/data/catalog";
import { loadCatalog } from "@/lib/repositories/catalogRepository";
import {
  deleteSetupProduct,
  updateSetupCategoryOrder,
  updateSetupProductActive
} from "@/lib/repositories/productSetupRepository";

export default function MenuPage() {
  const [catalog, setCatalog] = useState<PosCatalog | null>(null);
  const [query, setQuery] = useState("");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const products = catalog?.products ?? [];
  const visible = products.filter((product) => product.name.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")));

  useEffect(() => {
    loadCatalog().then((data) => {
      setCatalog(data);
      setEnabled(Object.fromEntries(data.products.map((product) => [product.id, product.active])));
    });
  }, []);

  async function toggleProduct(productId: string) {
    const active = !enabled[productId];
    setEnabled((current) => ({ ...current, [productId]: active }));
    await updateSetupProductActive(productId, active);
  }

  async function removeProduct(productId: string, productName: string) {
    if (!window.confirm(`Xóa món “${productName}”?`)) return;
    await deleteSetupProduct(productId);
    setCatalog((current) => current ? {
      ...current,
      products: current.products.filter((product) => product.id !== productId)
    } : current);
    setEnabled((current) => {
      const next = { ...current };
      delete next[productId];
      return next;
    });
  }

  async function moveCategory(index: number, direction: -1 | 1) {
    if (!catalog) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= catalog.categories.length) return;

    const categories = [...catalog.categories];
    const [category] = categories.splice(index, 1);
    categories.splice(targetIndex, 0, category);
    setCatalog({ ...catalog, categories });
    await updateSetupCategoryOrder(categories);
  }

  return (
    <main className="vp-screen vp-screen--plain">
      <header className="vp-screen-heading"><h1>Quản lý Thực đơn</h1></header>
      <label className="vp-search"><img src="/icons/search.svg" alt="" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm món..." aria-label="Tìm món" /></label>
      {catalog && (
        <section className="vp-menu-category-order" aria-label="Sắp xếp danh mục">
          <div className="vp-menu-category-heading">
            <strong>Sắp xếp danh mục</strong>
            <span>Dùng nút mũi tên để đổi vị trí trên màn hình bán hàng</span>
          </div>
          <div className="vp-menu-category-bar">
            {catalog.categories.map((category, index) => (
              <div className="vp-menu-category-item" key={category.id}>
                <span>{category.label}</span>
                <div>
                  <button type="button" onClick={() => moveCategory(index, -1)} disabled={index === 0} aria-label={`Đưa ${category.label} sang trái`}>←</button>
                  <button type="button" onClick={() => moveCategory(index, 1)} disabled={index === catalog.categories.length - 1} aria-label={`Đưa ${category.label} sang phải`}>→</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="vp-menu-list">
        {visible.length > 0 ? visible.map((product) => (
          <article className={`vp-menu-item ${enabled[product.id] ? "" : "is-disabled"}`} key={product.id}>
            <div className="vp-menu-copy"><strong>{product.name}</strong><span>{product.priceVnd.toLocaleString("vi-VN")}đ&nbsp; • &nbsp;{catalog?.categories.find((item) => item.id === product.category)?.label}</span></div>
            <div className="vp-menu-actions">
              <Link className="vp-menu-edit" href={`/setup?edit=${encodeURIComponent(product.id)}`}>Sửa</Link>
              <button className="vp-menu-delete" type="button" onClick={() => removeProduct(product.id, product.name)}>Xóa</button>
              <button className={`vp-switch ${enabled[product.id] ? "is-on" : ""}`} type="button" onClick={() => toggleProduct(product.id)} aria-label={`${enabled[product.id] ? "Tắt" : "Bật"} ${product.name}`} />
            </div>
          </article>
        )) : <div className="vp-menu-empty">Chưa có món phù hợp.</div>}
      </section>
      <Link className="vp-fab" href="/setup">＋&nbsp; Thêm món mới</Link>
    </main>
  );
}
