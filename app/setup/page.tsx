"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  createMockProduct,
  getCategoryLabel,
  PRODUCT_CATEGORIES,
  ProductCategoryId,
  SetupProduct
} from "@/lib/onboarding/productSetup";

export default function ProductSetupPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<ProductCategoryId>("coffee");
  const [imageName, setImageName] = useState("");
  const [products, setProducts] = useState<SetupProduct[]>([]);

  const priceVnd = Number(price);
  const canSave = name.trim().length > 0 && Number.isFinite(priceVnd) && priceVnd > 0;

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    setImageName(event.target.files?.[0]?.name ?? "");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;

    const product = createMockProduct(
      { name: name.trim(), priceVnd, categoryId },
      products.length + 1
    );

    setProducts((current) => [...current, product]);
    setName("");
    setPrice("");
    setImageName("");
  }

  return (
    <main className="vp-setup vp-onboarding">
      <header className="vp-setup-header">
        <Link className="vp-setup-back" href="/welcome" aria-label="Quay lại trang chào mừng">
          <img src="/icons/chevron-left.svg" alt="" />
        </Link>
        <div>
          <span>Thiết lập ban đầu</span>
          <h1>Thêm món mới</h1>
        </div>
      </header>

      <form className="vp-setup-form" onSubmit={handleSubmit}>
        <label className="vp-image-upload">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <span className="vp-image-upload-icon" aria-hidden="true">+</span>
          <strong>{imageName || "Thêm hình ảnh"}</strong>
          <small>Không bắt buộc</small>
        </label>

        <label className="vp-setup-field">
          <span>Tên món <b>*</b></span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ví dụ: Cà phê sữa" autoComplete="off" />
        </label>

        <label className="vp-setup-field">
          <span>Giá bán <b>*</b></span>
          <div className="vp-price-input">
            <input
              value={price}
              onChange={(event) => setPrice(event.target.value.replace(/\D/g, ""))}
              placeholder="0"
              inputMode="numeric"
              aria-label="Giá bán"
            />
            <span>đ</span>
          </div>
        </label>

        <label className="vp-setup-field">
          <span>Danh mục <b>*</b></span>
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value as ProductCategoryId)}>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>{category.label}</option>
            ))}
          </select>
        </label>

        {products.length > 0 && (
          <section className="vp-setup-saved" aria-live="polite">
            <div className="vp-setup-saved-heading">
              <div>
                <span>Menu khởi tạo</span>
                <strong>{products.length} món đã lưu</strong>
              </div>
              <span className="vp-setup-check" aria-hidden="true">✓</span>
            </div>
            <ul>
              {products.map((product) => (
                <li key={product.id}>
                  <div><strong>{product.name}</strong><span>{getCategoryLabel(product.categoryId)}</span></div>
                  <b>{product.priceVnd.toLocaleString("vi-VN")}đ</b>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="vp-setup-actions">
          <button className="vp-primary-button vp-save-product" type="submit" disabled={!canSave}>Lưu món</button>
          {products.length > 0 && <Link className="vp-start-selling" href="/">Bắt đầu bán hàng</Link>}
        </div>
      </form>
    </main>
  );
}
