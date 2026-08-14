import {
  openVeroPosDatabase,
  requestToPromise,
  STORES,
  transactionToPromise
} from "@/lib/storage/indexedDb";

const QR_SETTING_KEY = "payment-qr-code";

type PaymentQrSetting = {
  key: typeof QR_SETTING_KEY;
  imageDataUrl: string;
};

export async function loadPaymentQrCode(): Promise<string> {
  if (typeof window === "undefined") return "";

  const database = await openVeroPosDatabase();
  const transaction = database.transaction(STORES.settings, "readonly");
  const setting = await requestToPromise(
    transaction.objectStore(STORES.settings).get(QR_SETTING_KEY)
  ) as PaymentQrSetting | undefined;
  await transactionToPromise(transaction);
  return setting?.imageDataUrl ?? "";
}

export async function savePaymentQrCode(imageDataUrl: string): Promise<void> {
  const database = await openVeroPosDatabase();
  const transaction = database.transaction(STORES.settings, "readwrite");
  await requestToPromise(
    transaction.objectStore(STORES.settings).put({ key: QR_SETTING_KEY, imageDataUrl } satisfies PaymentQrSetting)
  );
  await transactionToPromise(transaction);
}

export async function clearPaymentQrCode(): Promise<void> {
  const database = await openVeroPosDatabase();
  const transaction = database.transaction(STORES.settings, "readwrite");
  await requestToPromise(transaction.objectStore(STORES.settings).delete(QR_SETTING_KEY));
  await transactionToPromise(transaction);
}
