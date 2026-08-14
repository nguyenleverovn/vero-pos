"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  createMockCategory,
  createMockProduct,
  getCategoryLabel,
  PRODUCT_CATEGORIES,
  ProductCategory,
  ProductCategoryId,
  SetupProduct
} from "@/lib/onboarding/productSetup";
import {
  completeProductSetup,
  loadProductSetup,
  saveProductSetup
} from "@/lib/repositories/productSetupRepository";

export default function ProductSetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<ProductCategoryId>("coffee");
  const [categoryName, setCategoryName] = useState("");
  const [imageName, setImageName] = useState("");
  const [active, setActive] = useState(true);
  const [categories, setCategories] = useState<ProductCategory[]>(PRODUCT_CATEGORIES);
  const [products, setProducts] = useState<SetupProduct[]>([]);
  const [completed, setCompleted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const priceVnd = Number(price);
  const canSave = name.trim().length > 0 && Number.isFinite(priceVnd) && priceVnd > 0;
  const canAddCategory = categoryName.trim().length > 0 && !categories.some((category) => category.label.toLocaleLowerCase("vi") === categoryName.trim().toLocaleLowerCase("vi"));

  useEffect(() => {
    let cancelled = false;
    loadProductSetup().then((setup) => {
      if (cancelled) return;
      setCategories(setup.categories);
      setProducts(setup.products);
      setCompleted(setup.completed);
      setCategoryId(setup.categories[0]?.id ?? "coffee");
      const requestedId = new URLSearchParams(window.location.search).get("edit");
      const requestedProduct = setup.products.find((product) => product.id === requestedId);
      if (requestedProduct) {
        setEditingId(requestedProduct.id);
        setName(requestedProduct.name);
        setPrice(String(requestedProduct.priceVnd));
        setCategoryId(requestedProduct.categoryId);
        setActive(requestedProduct.active);
      }
    });
    return () => { cancelled = true; };
  }, []);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    setImageName(event.target.files?.[0]?.name ?? "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;

    const product = editingId
      ? { ...products.find((item) => item.id === editingId)!, name: name.trim(), priceVnd, categoryId, active }
      : createMockProduct(
        { name: name.trim(), priceVnd, categoryId },
        Date.now(),
        active
      );

    const nextProducts = editingId
      ? products.map((item) => item.id === editingId ? product : item)
      : [...products, product];
    setProducts(nextProducts);
    await saveProductSetup({ categories, products: nextProducts, completed });
    setEditingId(null);
    setName("");
    setPrice("");
    setImageName("");
    router.replace("/setup");
  }

  async function handleAddCategory() {
    if (!canAddCategory) return;

    const category = createMockCategory(categoryName.trim(), categories.length + 1);
    const nextCategories = [...categories, category];
    setCategories(nextCategories);
    setCategoryId(category.id);
    setCategoryName("");
    await saveProductSetup({ categories: nextCategories, products, completed });
  }

  async function handleStartSelling() {
    await completeProductSetup(categories, products);
    router.push("/");
  }

  function cancelEditing() {
    setEditingId(null);
    setName("");
    setPrice("");
    setImageName("");
    setActive(true);
    setCategoryId(categories[0]?.id ?? "coffee");
    router.replace("/setup");
  }

  return (
    <main className="vp-setup">
      <header className="vp-setup-header">
        <Link className="vp-setup-back" href={completed ? "/menu" : "/welcome"} aria-label="Quay lại">
          <img src="/icons/chevron-left.svg" alt="" />
        </Link>
        <h1>{editingId ? "Chỉnh sửa món" : "Thêm món mới"}</h1>
      </header>

      <form className="vp-setup-form" onSubmit={handleSubmit}>
        <label className="vp-image-upload">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <span className="vp-image-upload-icon" aria-hidden="true"><span /></span>
          <strong>{imageName || "Tải ảnh lên"}</strong>
          <small>Hỗ trợ tệp PNG, JPG dung lượng tối đa 5MB</small>
        </label>

        <label className="vp-setup-field">
          <span>Tên món <b>*</b></span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ví dụ: Cà phê Muối" autoComplete="off" />
        </label>

        <label className="vp-setup-field">
          <span>Giá bán (đ) <b>*</b></span>
          <input
            value={price ? Number(price).toLocaleString("en-US") : ""}
            onChange={(event) => setPrice(event.target.value.replace(/\D/g, ""))}
            placeholder="45,000"
            inputMode="numeric"
            aria-label="Giá bán"
          />
        </label>

        <div className="vp-setup-status">
          <div><strong>Trạng thái hoạt động</strong><span>Cho phép bán ngay sau khi tạo</span></div>
          <button className={`vp-switch ${active ? "is-on" : ""}`} type="button" onClick={() => setActive((current) => !current)} aria-label={active ? "Tắt trạng thái hoạt động" : "Bật trạng thái hoạt động"} />
        </div>

        <label className="vp-setup-field vp-setup-field--category">
          <span>Danh mục <b>*</b></span>
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value as ProductCategoryId)}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.label}</option>
            ))}
          </select>
          <div className="vp-category-create">
            <input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="Tên danh mục mới" autoComplete="off" />
            <button type="button" onClick={handleAddCategory} disabled={!canAddCategory}>Thêm</button>
          </div>
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
                  <div><strong>{product.name}</strong><span>{getCategoryLabel(product.categoryId, categories)}</span></div>
                  <b>{product.priceVnd.toLocaleString("vi-VN")}đ</b>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="vp-setup-actions">
          <button className="vp-primary-button vp-save-product" type="submit" disabled={!canSave}>{editingId ? "Lưu thay đổi" : "Lưu món mới (1 chạm)"}</button>
          {editingId ? <button className="vp-start-selling" type="button" onClick={cancelEditing}>Hủy chỉnh sửa</button> : products.length > 0 && <button className="vp-start-selling" type="button" onClick={handleStartSelling}>Bắt đầu bán hàng</button>}
        </div>
      </form>
    </main>
  );
}
