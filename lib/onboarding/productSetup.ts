export const PRODUCT_CATEGORIES = [
  { id: "coffee", label: "Cà phê" },
  { id: "tea", label: "Trà" },
  { id: "drinks", label: "Nước" },
  { id: "bakery", label: "Bánh" }
] as const;

export type ProductCategoryId = (typeof PRODUCT_CATEGORIES)[number]["id"];

export type ProductDraft = {
  name: string;
  priceVnd: number;
  categoryId: ProductCategoryId;
};

export type SetupProduct = ProductDraft & {
  id: string;
  active: boolean;
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

export function getCategoryLabel(categoryId: ProductCategoryId) {
  return PRODUCT_CATEGORIES.find((category) => category.id === categoryId)?.label ?? "";
}
