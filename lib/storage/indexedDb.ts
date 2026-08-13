const DATABASE_NAME = "vero-pos-local";
const DATABASE_VERSION = 1;

export const STORES = {
  categories: "categories",
  products: "products",
  settings: "settings",
  orders: "orders"
} as const;

let databasePromise: Promise<IDBDatabase> | null = null;

export function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

export function transactionToPromise(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed"));
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
  });
}

export function openVeroPosDatabase(): Promise<IDBDatabase> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.reject(new Error("IndexedDB is not available"));
  }

  if (databasePromise) return databasePromise;

  databasePromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORES.categories)) {
        database.createObjectStore(STORES.categories, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(STORES.products)) {
        database.createObjectStore(STORES.products, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(STORES.settings)) {
        database.createObjectStore(STORES.settings, { keyPath: "key" });
      }
      if (!database.objectStoreNames.contains(STORES.orders)) {
        const orders = database.createObjectStore(STORES.orders, { keyPath: "id" });
        orders.createIndex("createdAt", "createdAt");
      }
    };

    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => database.close();
      resolve(database);
    };
    request.onerror = () => {
      databasePromise = null;
      reject(request.error ?? new Error("Could not open VERO POS database"));
    };
    request.onblocked = () => {
      databasePromise = null;
      reject(new Error("VERO POS database upgrade is blocked"));
    };
  });

  return databasePromise;
}
