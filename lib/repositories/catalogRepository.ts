import { PosCatalog, getCatalog } from "@/lib/data/catalog";
import { loadProductSetup } from "@/lib/onboarding/productSetup";

export async function loadCatalog(): Promise<PosCatalog> {
  // Migration point: replace this with IndexedDB/API fetch without changing UI contract.
  if (typeof window === "undefined") return getCatalog();

  const setup = loadProductSetup();
  if (!setup.completed) return getCatalog();

  return {
    generatedAt: new Date().toISOString(),
    source: "local-setup-v1",
    categories: setup.categories,
    products: setup.products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.categoryId,
      priceVnd: product.priceVnd,
      active: product.active
    }))
  };
}
