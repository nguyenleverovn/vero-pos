import { Category } from "@/lib/data/catalog";

export type CategoryFilter = Category["id"] | "all";

type CategoryTabsProps = {
  activeCategory: CategoryFilter;
  items: Category[];
  onChange: (category: CategoryFilter) => void;
};

export function CategoryTabs({ activeCategory, items, onChange }: CategoryTabsProps) {
  return (
    <div className="vp-category-tabs" role="tablist" aria-label="Danh mục sản phẩm">
      <button
        type="button"
        className={`vp-category-tab ${activeCategory === "all" ? "is-active" : ""}`}
        onClick={() => onChange("all")}
        role="tab"
        aria-selected={activeCategory === "all"}
      >
        Tất cả món
      </button>
      {items.map((item) => {
        const active = item.id === activeCategory;

        return (
          <button
            type="button"
            key={item.id}
            className={`vp-category-tab ${active ? "is-active" : ""}`}
            onClick={() => onChange(item.id)}
            role="tab"
            aria-selected={active}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
