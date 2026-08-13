export type CategoryId = string;

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  priceVnd: number;
  note?: string;
  active: boolean;
};

export type Category = { id: CategoryId; label: string };
export type PosCatalog = {
  generatedAt: string;
  source: "local-fixture-v1" | "local-setup-v1";
  categories: Category[];
  products: Product[];
};

const catalog: PosCatalog = {
  generatedAt: "2026-08-13T00:00:00+07:00",
  source: "local-fixture-v1",
  categories: [
    { id: "coffee", label: "Cà phê" },
    { id: "fruit-tea", label: "Trà trái cây" },
    { id: "blended", label: "Đá xay" },
    { id: "topping", label: "Topping" },
    { id: "other", label: "Khác" }
  ],
  products: [
    { id: "espresso", category: "coffee", name: "Espresso", priceVnd: 35000, active: true },
    { id: "americano", category: "coffee", name: "Americano", priceVnd: 40000, active: true },
    { id: "latte", category: "coffee", name: "Latte", priceVnd: 45000, active: true },
    { id: "cappuccino", category: "coffee", name: "Cappuccino", priceVnd: 45000, active: true },
    { id: "bac-xiu", category: "coffee", name: "Bạc xỉu", priceVnd: 35000, active: true },
    { id: "tra-dao", category: "fruit-tea", name: "Trà đào", priceVnd: 40000, active: true },
    { id: "matcha", category: "blended", name: "Matcha", priceVnd: 50000, active: true },
    { id: "mochaccino", category: "coffee", name: "Mochaccino", priceVnd: 50000, active: true },
    { id: "cold-brew", category: "coffee", name: "Cold Brew", priceVnd: 55000, active: true },
    { id: "chai-latte", category: "other", name: "Chai Latte", priceVnd: 55000, active: true },
    { id: "tra-dao-hong-hac", category: "fruit-tea", name: "Trà Đào Hồng Hạc", priceVnd: 45000, active: true },
    { id: "matcha-da-xay", category: "blended", name: "Matcha Đá Xay", priceVnd: 55000, active: false },
    { id: "croissant", category: "other", name: "Bánh Croissant", priceVnd: 30000, active: true }
  ]
};

export function getCatalog(): PosCatalog { return catalog; }
