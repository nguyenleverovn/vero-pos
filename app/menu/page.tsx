"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PosCatalog } from "@/lib/data/catalog";
import { loadCatalog } from "@/lib/repositories/catalogRepository";
import { updateSetupProductActive, deleteSetupProduct, updateSetupProduct } from "@/lib/repositories/productSetupRepository";

export default function MenuPage() {
  const [catalog, setCatalog] = useState<PosCatalog | null>(null);
  const [query, setQuery] = useState("");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

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

  async function handleDeleteProduct(productId: string) {
    if (confirm("Bạn có chắc muốn xóa món này?")) {
      await deleteSetupProduct(productId);
      setCatalog((current) => {
        if (!current) return null;
        return {
          ...current,
          products: current.products.filter((p) => p.id !== productId)
        };
      });
      setEditingId(null);
    }
  }

  async function handleSaveEdit(productId: string) {
    const newPrice = parseInt(editPrice, 10);
    if (!editName.trim() || isNaN(newPrice) || newPrice <= 0) {
      alert("Tên và giá không hợp lệ");
      return;
    }

    await updateSetupProduct(productId, {
      name: editName.trim(),
      priceVnd: newPrice
    });

    setCatalog((current) => {
      if (!current) return null;
      return {
        ...current,
        products: current.products.map((p) =>
          p.id === productId ? { ...p, name: editName.trim(), priceVnd: newPrice } : p
        )
      };
    });
    setEditingId(null);
  }

  function startEdit(product: typeof products[0]) {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(product.priceVnd.toString());
  }

  return (
    <main className="vp-screen vp-screen--plain">
      <header className="vp-screen-heading"><h1>Quản lý Thực đơn</h1></header>
      <label className="vp-search"><img src="/icons/search.svg" alt="" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm món..." aria-label="Tìm món" /></label>
      <section className="vp-menu-list">
        {visible.length > 0 ? visible.map((product) => (
          <article key={product.id} className={`vp-menu-item ${enabled[product.id] ? "" : "is-disabled"}`}>
            {editingId === product.id ? (
              <div className="vp-menu-edit-form">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Tên món"
                  className="vp-menu-edit-input"
                />
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="Giá"
                  className="vp-menu-edit-input"
                  min="1000"
                  step="1000"
                />
                <div className="vp-menu-edit-actions">
                  <button
                    className="vp-button vp-button--primary"
                    onClick={() => handleSaveEdit(product.id)}
                  >
                    Lưu
                  </button>
                  <button
                    className="vp-button vp-button--secondary"
                    onClick={() => setEditingId(null)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="vp-menu-copy"><strong>{product.name}</strong><span>{product.priceVnd.toLocaleString("vi-VN")}đ&nbsp; • &nbsp;{catalog?.categories.find((item) => item.id === product.category)?.label}</span></div>
                <div className="vp-menu-actions">
                  <button
                    className="vp-menu-action-btn vp-menu-edit-btn"
                    onClick={() => startEdit(product)}
                    title="Chỉnh sửa"
                    aria-label={`Chỉnh sửa ${product.name}`}
                  >
                    ✎
                  </button>
                  <button
                    className={`vp-switch ${enabled[product.id] ? "is-on" : ""}`}
                    onClick={() => toggleProduct(product.id)}
                    aria-label={`${enabled[product.id] ? "Tắt" : "Bật"} ${product.name}`}
                  >
                  </button>
                  <button
                    className="vp-menu-action-btn vp-menu-delete-btn"
                    onClick={() => handleDeleteProduct(product.id)}
                    title="Xóa"
                    aria-label={`Xóa ${product.name}`}
                  >
                    ✕
                  </button>
                </div>
              </>
            )}
          </article>
        )) : <div className="vp-menu-empty">Chưa có món phù hợp.</div>}
      </section>
      <Link className="vp-fab" href="/setup">＋&nbsp; Thêm món mới</Link>

      <style jsx>{`
        .vp-menu-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .vp-menu-action-btn {
          background: none;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0.5rem;
          color: #51608d;
          transition: color 0.2s;
        }

        .vp-menu-action-btn:hover {
          color: #0f1d3a;
        }

        .vp-menu-edit-btn {
          color: #2d6ce5;
        }

        .vp-menu-edit-btn:hover {
          color: #1f57c7;
        }

        .vp-menu-delete-btn {
          color: #f5a524;
        }

        .vp-menu-delete-btn:hover {
          color: #d48e1a;
        }

        .vp-menu-edit-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 0.75rem 0;
        }

        .vp-menu-edit-input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d3ddff;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-family: inherit;
        }

        .vp-menu-edit-input:focus {
          outline: none;
          border-color: #2d6ce5;
          box-shadow: 0 0 0 2px rgba(45, 108, 229, 0.1);
        }

        .vp-menu-edit-actions {
          display: flex;
          gap: 0.5rem;
        }

        .vp-button {
          flex: 1;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .vp-button--primary {
          background-color: #2d6ce5;
          color: white;
        }

        .vp-button--primary:hover {
          background-color: #1f57c7;
        }

        .vp-button--secondary {
          background-color: #f8f9fc;
          color: #0f1d3a;
          border: 1px solid #d3ddff;
        }

        .vp-button--secondary:hover {
          background-color: #f3f6ff;
        }
      `}</style>
    </main>
  );
}
