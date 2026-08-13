export type ProductCategory = {
  id: string;
  label: string;
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: "coffee", label: "Cà phê" },
  { id: "tea", label: "Trà" },
  { id: "drinks", label: "Nước" },
  { id: "bakery", label: "Bánh" }
];

export type ProductCategoryId = string;

export type ProductDraft = {
  name: string;
  priceVnd: number;
  categoryId: ProductCategoryId;
};

export type SetupProduct = ProductDraft & {
  id: string;
  active: boolean;
};

export type ProductSetupState = {
  categories: ProductCategory[];
  products: SetupProduct[];
  completed: boolean;
};

export interface ProductSetupRepository {
  createProduct(draft: ProductDraft): Promise<SetupProduct>;
}

export function createMockProduct(draft: ProductDraft, sequence: number, active = true): SetupProduct {
  return {
    ...draft,
    id: `mock-product-${sequence}`,
    active
  };
}

const PRODUCT_SETUP_STORAGE_KEY = "vero-pos-product-setup-v1";

export function createMockCategory(label: string, sequence: number): ProductCategory {
  const slug = label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return { id: `${slug || "category"}-${sequence}`, label };
}

export function getInitialProductSetup(): ProductSetupState {
  return {
    categories: PRODUCT_CATEGORIES.map((category) => ({ ...category })),
    products: [],
    completed: false
  };
}

export function loadProductSetup(): ProductSetupState {
  const initial = getInitialProductSetup();
  if (typeof window === "undefined") return initial;

  try {
    const parsed = JSON.parse(window.localStorage.getItem(PRODUCT_SETUP_STORAGE_KEY) ?? "null") as Partial<ProductSetupState> | null;
    if (!parsed || !Array.isArray(parsed.categories) || !Array.isArray(parsed.products)) return initial;

    return {
      categories: parsed.categories.length > 0 ? parsed.categories : initial.categories,
      products: parsed.products,
      completed: parsed.completed === true
    };
  } catch {
    return initial;
  }
}

export function saveProductSetup(state: ProductSetupState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRODUCT_SETUP_STORAGE_KEY, JSON.stringify(state));
}

export function completeProductSetup(categories: ProductCategory[], products: SetupProduct[]): void {
  saveProductSetup({ categories, products, completed: true });
}

export function isProductSetupComplete(): boolean {
  return loadProductSetup().completed;
}

export function updateSetupProductActive(productId: string, active: boolean): void {
  const state = loadProductSetup();
  saveProductSetup({
    ...state,
    products: state.products.map((product) => product.id === productId ? { ...product, active } : product)
  });
}

export function getCategoryLabel(categoryId: ProductCategoryId, categories: ProductCategory[] = PRODUCT_CATEGORIES) {
  return categories.find((category) => category.id === categoryId)?.label ?? "";
}
