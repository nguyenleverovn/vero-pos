import { CartItem, getCartTotal } from "@/lib/cart/cart";
import {
  openVeroPosDatabase,
  requestToPromise,
  STORES,
  transactionToPromise
} from "@/lib/storage/indexedDb";

export type PaymentMethod = "cash" | "transfer";

export type OrderLine = {
  productId: string;
  name: string;
  priceVnd: number;
  quantity: number;
};

export type PosOrder = {
  id: string;
  createdAt: string;
  paymentMethod: PaymentMethod;
  items: OrderLine[];
  totalVnd: number;
};

function createOrderId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `order-${Date.now()}`;
}

export async function saveOrder(items: CartItem[], paymentMethod: PaymentMethod): Promise<PosOrder> {
  const order: PosOrder = {
    id: createOrderId(),
    createdAt: new Date().toISOString(),
    paymentMethod,
    items: items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      priceVnd: item.product.priceVnd,
      quantity: item.quantity
    })),
    totalVnd: getCartTotal(items)
  };

  const database = await openVeroPosDatabase();
  const transaction = database.transaction(STORES.orders, "readwrite");
  await requestToPromise(transaction.objectStore(STORES.orders).put(order));
  await transactionToPromise(transaction);
  return order;
}

export async function loadOrders(): Promise<PosOrder[]> {
  if (typeof window === "undefined") return [];

  const database = await openVeroPosDatabase();
  const transaction = database.transaction(STORES.orders, "readonly");
  const orders = await requestToPromise(transaction.objectStore(STORES.orders).getAll()) as PosOrder[];
  await transactionToPromise(transaction);
  return orders.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}
