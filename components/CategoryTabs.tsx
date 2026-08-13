import { Category } from "@/lib/data/catalog";

type CategoryTabsProps = {
  activeCategory: Category["id"];
  items: Category[];
  onChange: (category: Category["id"]) => void;
};

export function CategoryTabs({ activeCategory, items, onChange }: CategoryTabsProps) {
  return (
    <div className="vp-category-tabs" role="tablist" aria-label="Danh mục sản phẩm">
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
