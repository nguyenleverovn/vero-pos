import { Category } from "@/lib/data/catalog";

type CategoryTabsProps = {
  activeCategory: Category["id"] | "all";
  items: Category[];
  onChange: (category: Category["id"] | "all") => void;
};

export function CategoryTabs({ activeCategory, items, onChange }: CategoryTabsProps) {
  return (
    <div className="vp-category-tabs" role="tablist" aria-label="Danh mục sản phẩm">
      <div className="vp-category-header">
        <div className="vp-category-branding">
          <strong>VERO POS</strong>
          <span>CHẠM LÀ CHẠY</span>
        </div>
      </div>
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

      <style jsx>{`
        .vp-category-header {
          padding: 1rem;
          background: linear-gradient(135deg, #2d6ce5 0%, #1f57c7 100%);
          text-align: center;
          border-bottom: 2px solid #1f57c7;
        }

        .vp-category-branding {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          color: white;
        }

        .vp-category-branding strong {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .vp-category-branding span {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
