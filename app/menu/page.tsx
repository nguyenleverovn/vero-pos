"use client";

import { useState } from "react";
import { getCatalog } from "@/lib/data/catalog";

const menuProductIds = ["espresso", "americano", "bac-xiu", "tra-dao-hong-hac", "matcha-da-xay", "croissant"];

export default function MenuPage() {
  const products = getCatalog().products.filter((product) => menuProductIds.includes(product.id));
  const [query, setQuery] = useState("");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => Object.fromEntries(products.map((product) => [product.id, product.active])));
  const visible = products.filter((product) => product.name.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")));

  return (
    <main className="vp-screen vp-screen--plain">
      <header className="vp-screen-heading"><h1>Quản lý Thực đơn</h1></header>
      <label className="vp-search"><img src="/icons/search.svg" alt="" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm món..." aria-label="Tìm món" /></label>
      <section className="vp-menu-list">
        {visible.map((product) => (
          <article className={`vp-menu-item ${enabled[product.id] ? "" : "is-disabled"}`} key={product.id}>
            <div className="vp-menu-copy"><strong>{product.name}</strong><span>{product.priceVnd.toLocaleString("vi-VN")}đ&nbsp; • &nbsp;{getCatalog().categories.find((item) => item.id === product.category)?.label}</span></div>
            <button className={`vp-switch ${enabled[product.id] ? "is-on" : ""}`} onClick={() => setEnabled((current) => ({ ...current, [product.id]: !current[product.id] }))} aria-label={`${enabled[product.id] ? "Tắt" : "Bật"} ${product.name}`} />
          </article>
        ))}
      </section>
      <button className="vp-fab">＋&nbsp; Thêm món mới</button>
    </main>
  );
}
