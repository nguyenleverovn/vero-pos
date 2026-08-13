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

export function getCategoryLabel(categoryId: ProductCategoryId, categories: ProductCategory[] = PRODUCT_CATEGORIES) {
  return categories.find((category) => category.id === categoryId)?.label ?? "";
}
