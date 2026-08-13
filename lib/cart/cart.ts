import { Product } from "@/lib/data/catalog";

export type CartItem = {
  product: Product;
  quantity: number;
};

type StoredCartItem = {
  productId: string;
  quantity: number;
};

const CART_STORAGE_KEY = "vero-pos-cart-v1";

export function addProduct(items: CartItem[], product: Product): CartItem[] {
  const existing = items.find((item) => item.product.id === product.id);

  return existing
    ? items.map((item) => item.product.id === product.id
      ? { ...item, quantity: item.quantity + 1 }
      : item)
    : [...items, { product, quantity: 1 }];
}

export function changeQuantity(items: CartItem[], productId: string, quantity: number): CartItem[] {
  if (quantity <= 0) return removeProduct(items, productId);

  return items.map((item) => item.product.id === productId
    ? { ...item, quantity }
    : item);
}

export function removeProduct(items: CartItem[], productId: string): CartItem[] {
  return items.filter((item) => item.product.id !== productId);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.priceVnd * item.quantity, 0);
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;

  const storedItems: StoredCartItem[] = items.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity
  }));
  window.sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storedItems));
}

export function loadCart(products: Product[]): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const rawItems = JSON.parse(window.sessionStorage.getItem(CART_STORAGE_KEY) ?? "[]") as unknown;
    if (!Array.isArray(rawItems)) return [];

    return rawItems.flatMap((rawItem) => {
      if (!rawItem || typeof rawItem !== "object") return [];

      const stored = rawItem as Partial<StoredCartItem>;
      const product = products.find((item) => item.id === stored.productId && item.active);
      const quantity = Math.floor(Number(stored.quantity));

      return product && Number.isFinite(quantity) && quantity > 0
        ? [{ product, quantity }]
        : [];
    });
  } catch {
    return [];
  }
}
