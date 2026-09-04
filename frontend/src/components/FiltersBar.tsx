import { CATEGORIES, type Category, type ExpenseFilters } from "../types/expense";

interface FiltersBarProps {
  filters: ExpenseFilters;
  onChange: (filters: ExpenseFilters) => void;
}

export function FiltersBar({ filters, onChange }: FiltersBarProps) {
  return (
    <div className="filters-bar">
      <label>
        From
        <input
          type="date"
          value={filters.startDate ?? ""}
          onChange={(e) => onChange({ ...filters, startDate: e.target.value || undefined, page: 0 })}
        />
      </label>
      <label>
        To
        <input
          type="date"
          value={filters.endDate ?? ""}
          onChange={(e) => onChange({ ...filters, endDate: e.target.value || undefined, page: 0 })}
        />
      </label>
      <label>
        Category
        <select
          value={filters.category ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              category: (e.target.value || undefined) as Category | undefined,
              page: 0,
            })
          }
        >
          <option value="">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      {(filters.startDate || filters.endDate || filters.category) && (
        <button type="button" className="secondary" onClick={() => onChange({ page: 0 })}>
          Clear filters
        </button>
      )}
    </div>
  );
}
