import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { CATEGORIES, type Category, type Expense, type ExpenseInput } from "../types/expense";

interface FormState {
  title: string;
  amount: number | "";
  category: Category;
  date: string;
  notes: string;
}

const emptyForm: FormState = {
  title: "",
  amount: "",
  category: "FOOD",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

interface ExpenseFormProps {
  editingExpense: Expense | null;
  onSubmit: (input: ExpenseInput) => Promise<void>;
  onCancelEdit: () => void;
}

export function ExpenseForm({ editingExpense, onSubmit, onCancelEdit }: ExpenseFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: editingExpense.date,
        notes: editingExpense.notes ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingExpense]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!(Number(form.amount) > 0)) {
      setError("Amount must be greater than zero");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
      if (!editingExpense) {
        setForm(emptyForm);
      }
    } catch {
      setError("Failed to save expense");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>

      <label>
        Title
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          maxLength={120}
        />
      </label>

      <div className="form-row">
        <label>
          Amount
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={form.amount}
            onFocus={(e) => {
              if (form.amount === 0) {
                setForm({ ...form, amount: "" });
              } else {
                e.target.select();
              }
            }}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value === "" ? "" : Number(e.target.value) })
            }
          />
        </label>

        <label>
          Category
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Date
        <input
          type="date"
          value={form.date}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
      </label>

      <label>
        Notes
        <textarea
          value={form.notes ?? ""}
          maxLength={500}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {editingExpense ? "Save changes" : "Add expense"}
        </button>
        {editingExpense && (
          <button type="button" className="secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
