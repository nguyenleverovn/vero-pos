import { PosCatalog, getCatalog } from "@/lib/data/catalog";
import { loadProductSetup } from "@/lib/repositories/productSetupRepository";

export async function loadCatalog(): Promise<PosCatalog> {
  if (typeof window === "undefined") return getCatalog();

  const setup = await loadProductSetup();
  if (!setup.completed) return getCatalog();

  return {
    generatedAt: new Date().toISOString(),
    source: "indexeddb-v1",
    categories: setup.categories,
    products: setup.products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.categoryId,
      priceVnd: product.priceVnd,
      note: product.note,
      active: product.active
    }))
  };
}
