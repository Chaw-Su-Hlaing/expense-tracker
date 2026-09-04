import type { Category } from "../types/expense";
import { titleCase } from "../utils/format";

const PASTELS = ["#8c97d6", "#f6c9dc", "#f3efb0", "#63c1e8"] as const;

const CATEGORY_COLORS: Record<Category, string> = {
  FOOD: PASTELS[1],
  TRANSPORT: PASTELS[3],
  BILLS: PASTELS[0],
  ENTERTAINMENT: PASTELS[2],
  HEALTH: PASTELS[1],
  SHOPPING: PASTELS[3],
  EDUCATION: PASTELS[0],
  OTHER: PASTELS[2],
};

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className="category-badge"
      style={{ backgroundColor: CATEGORY_COLORS[category] }}
    >
      {titleCase(category)}
    </span>
  );
}

export { CATEGORY_COLORS };
