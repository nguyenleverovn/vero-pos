import {
  openVeroPosDatabase,
  requestToPromise,
  STORES,
  transactionToPromise
} from "@/lib/storage/indexedDb";

export type UsageEventName =
  | "app_open"
  | "app_installed"
  | "welcome_started"
  | "first_product_created"
  | "setup_completed"
  | "order_completed";

type DeviceClass = "mobile" | "tablet" | "desktop";

type StoredUsageEvent = {
  id: string;
  name: UsageEventName;
  occurredAt: string;
  installationId: string;
  appVersion: string;
  deviceClass: DeviceClass;
  connection: "online" | "offline";
};

const INSTALLATION_ID_KEY = "vero-pos-anonymous-installation-id";
const MAX_QUEUED_EVENTS = 500;
const BATCH_SIZE = 50;
let flushing = false;

function createAnonymousId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `anonymous-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getInstallationId() {
  const existing = window.localStorage.getItem(INSTALLATION_ID_KEY);
  if (existing) return existing;

  const created = createAnonymousId();
  window.localStorage.setItem(INSTALLATION_ID_KEY, created);
  return created;
}

function getDeviceClass(): DeviceClass {
  if (window.innerWidth < 640) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

async function trimQueue() {
  const database = await openVeroPosDatabase();
  const readTransaction = database.transaction(STORES.analyticsEvents, "readonly");
  const events = await requestToPromise(
    readTransaction.objectStore(STORES.analyticsEvents).index("occurredAt").getAll()
  ) as StoredUsageEvent[];
  await transactionToPromise(readTransaction);

  const overflow = events.length - MAX_QUEUED_EVENTS;
  if (overflow <= 0) return;

  const writeTransaction = database.transaction(STORES.analyticsEvents, "readwrite");
  const store = writeTransaction.objectStore(STORES.analyticsEvents);
  events.slice(0, overflow).forEach((event) => store.delete(event.id));
  await transactionToPromise(writeTransaction);
}

export async function trackUsageEvent(name: UsageEventName): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const event: StoredUsageEvent = {
      id: createAnonymousId(),
      name,
      occurredAt: new Date().toISOString(),
      installationId: getInstallationId(),
      appVersion: process.env.NEXT_PUBLIC_VERO_APP_VERSION ?? "v1",
      deviceClass: getDeviceClass(),
      connection: navigator.onLine ? "online" : "offline"
    };
    const database = await openVeroPosDatabase();
    const transaction = database.transaction(STORES.analyticsEvents, "readwrite");
    transaction.objectStore(STORES.analyticsEvents).put(event);
    await transactionToPromise(transaction);
    await trimQueue();

    if (navigator.onLine) void flushUsageEvents();
  } catch {
    // Analytics must never interrupt selling.
  }
}

export async function flushUsageEvents(): Promise<void> {
  const endpoint = process.env.NEXT_PUBLIC_VERO_ANALYTICS_ENDPOINT?.trim();
  if (typeof window === "undefined" || !endpoint || !navigator.onLine || flushing) return;

  flushing = true;
  try {
    const database = await openVeroPosDatabase();
    for (let batchNumber = 0; batchNumber < 5; batchNumber += 1) {
      const readTransaction = database.transaction(STORES.analyticsEvents, "readonly");
      const events = await requestToPromise(
        readTransaction.objectStore(STORES.analyticsEvents).index("occurredAt").getAll(null, BATCH_SIZE)
      ) as StoredUsageEvent[];
      await transactionToPromise(readTransaction);
      if (events.length === 0) break;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "vero-pos", schemaVersion: 1, events }),
        keepalive: true
      });
      if (!response.ok) break;

      const deleteTransaction = database.transaction(STORES.analyticsEvents, "readwrite");
      const store = deleteTransaction.objectStore(STORES.analyticsEvents);
      events.forEach((event) => store.delete(event.id));
      await transactionToPromise(deleteTransaction);
      if (events.length < BATCH_SIZE) break;
    }
  } catch {
    // Keep queued events for the next online attempt.
  } finally {
    flushing = false;
  }
}
