"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PosCatalog } from "@/lib/data/catalog";
import { updateSetupProductActive } from "@/lib/onboarding/productSetup";
import { loadCatalog } from "@/lib/repositories/catalogRepository";

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

  function toggleProduct(productId: string) {
    setEnabled((current) => {
      const active = !current[productId];
      updateSetupProductActive(productId, active);
      return { ...current, [productId]: active };
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
            <button className={`vp-switch ${enabled[product.id] ? "is-on" : ""}`} onClick={() => toggleProduct(product.id)} aria-label={`${enabled[product.id] ? "Tắt" : "Bật"} ${product.name}`} />
          </article>
        )) : <div className="vp-menu-empty">Chưa có món phù hợp.</div>}
      </section>
      <Link className="vp-fab" href="/setup">＋&nbsp; Thêm món mới</Link>
    </main>
  );
}
