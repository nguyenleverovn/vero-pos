import { PosCatalog, getCatalog } from "@/lib/data/catalog";

export async function loadCatalog(): Promise<PosCatalog> {
  // Migration point: replace this with IndexedDB/API fetch without changing UI contract.
  return getCatalog();
}
