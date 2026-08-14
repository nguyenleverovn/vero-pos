"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PosCatalog } from "@/lib/data/catalog";
import { loadCatalog } from "@/lib/repositories/catalogRepository";
import { deleteSetupProduct, updateSetupProductActive } from "@/lib/repositories/productSetupRepository";

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

  return (
    <main className="vp-screen vp-screen--plain">
      <header className="vp-screen-heading"><h1>Quản lý Thực đơn</h1></header>
      <label className="vp-search"><img src="/icons/search.svg" alt="" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm món..." aria-label="Tìm món" /></label>
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
