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
  orderNumber: string;
  createdAt: string;
  paymentMethod: PaymentMethod;
  items: OrderLine[];
  totalVnd: number;
};

async function getNextOrderNumber(): Promise<string> {
  const orders = await loadOrders();
  // Extract numeric part from order numbers and find max
  const numbers = orders
    .map(order => {
      const match = order.orderNumber.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    })
    .filter(num => num > 0);

  const nextNumber = (Math.max(...numbers, 0) + 1).toString().padStart(2, '0');
  return `order${nextNumber}`;
}

function createOrderId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `order-${Date.now()}`;
}

export async function saveOrder(items: CartItem[], paymentMethod: PaymentMethod): Promise<PosOrder> {
  const orderNumber = await getNextOrderNumber();
  
  const order: PosOrder = {
    id: createOrderId(),
    orderNumber,
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

export async function loadOrderById(orderId: string): Promise<PosOrder | null> {
  if (typeof window === "undefined") return null;

  const database = await openVeroPosDatabase();
  const transaction = database.transaction(STORES.orders, "readonly");
  const order = await requestToPromise(transaction.objectStore(STORES.orders).get(orderId)) as PosOrder | undefined;
  await transactionToPromise(transaction);
  return order ?? null;
}
