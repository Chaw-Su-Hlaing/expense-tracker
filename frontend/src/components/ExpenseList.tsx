import type { Expense, PagedResponse } from "../types/expense";
import { formatCurrency, formatDate } from "../utils/format";
import { CategoryBadge } from "./CategoryBadge";

interface ExpenseListProps {
  data: PagedResponse<Expense>;
  loading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
}

export function ExpenseList({ data, loading, onEdit, onDelete, onPageChange }: ExpenseListProps) {
  if (loading && data.content.length === 0) {
    return <p className="empty-state">Loading expenses…</p>;
  }

  if (!loading && data.content.length === 0) {
    return <p className="empty-state">No expenses found. Add your first one!</p>;
  }

  return (
    <div className="expense-list">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th className="numeric">Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.content.map((expense) => (
            <tr key={expense.id}>
              <td>{formatDate(expense.date)}</td>
              <td>
                {expense.title}
                {expense.notes && <div className="notes">{expense.notes}</div>}
              </td>
              <td>
                <CategoryBadge category={expense.category} />
              </td>
              <td className="numeric">{formatCurrency(expense.amount)}</td>
              <td className="row-actions">
                <button type="button" className="link" onClick={() => onEdit(expense)}>
                  Edit
                </button>
                <button type="button" className="link danger" onClick={() => onDelete(expense.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.totalPages > 1 && (
        <div className="pagination">
          <button type="button" disabled={data.page === 0} onClick={() => onPageChange(data.page - 1)}>
            Previous
          </button>
          <span>
            Page {data.page + 1} of {data.totalPages}
          </span>
          <button type="button" disabled={data.last} onClick={() => onPageChange(data.page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
