import type { Summary } from "../types/expense";
import { formatCurrency } from "../utils/format";
import { CATEGORY_COLORS, CategoryBadge } from "./CategoryBadge";

export function SummaryPanel({ summary, loading }: { summary: Summary | null; loading: boolean }) {
  if (loading && !summary) {
    return <p className="empty-state">Loading summary…</p>;
  }
  if (!summary) {
    return null;
  }

  return (
    <div className="summary-panel">
      <div className="summary-totals">
        <div className="summary-tile tile-today">
          <span className="summary-label">Today</span>
          <span className="summary-value">{formatCurrency(summary.todayTotal)}</span>
        </div>
        <div className="summary-tile tile-month">
          <span className="summary-label">{summary.month}</span>
          <span className="summary-value">{formatCurrency(summary.monthTotal)}</span>
        </div>
      </div>

      {summary.categoryBreakdown.length > 0 && (
        <div className="category-breakdown">
          {summary.categoryBreakdown.map((row) => (
            <div className="breakdown-row" key={row.category}>
              <CategoryBadge category={row.category} />
              <div className="breakdown-bar-track">
                <div
                  className="breakdown-bar-fill"
                  style={{
                    width: `${row.percentage}%`,
                    backgroundColor: CATEGORY_COLORS[row.category],
                  }}
                />
              </div>
              <span className="breakdown-amount">{formatCurrency(row.total)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
