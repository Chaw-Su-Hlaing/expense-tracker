import { useState } from "react";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseList } from "./components/ExpenseList";
import { FiltersBar } from "./components/FiltersBar";
import { SummaryPanel } from "./components/SummaryPanel";
import { useExpenses } from "./hooks/useExpenses";
import { useSummary } from "./hooks/useSummary";
import type { Expense, ExpenseFilters } from "./types/expense";
import "./App.css";

function App() {
  const [filters, setFilters] = useState<ExpenseFilters>({ page: 0 });
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const { data, loading, error, add, edit, remove } = useExpenses(filters);
  const { summary, loading: summaryLoading, refresh: refreshSummary } = useSummary();

  const handleSubmit = async (input: Parameters<typeof add>[0]) => {
    if (editingExpense) {
      await edit(editingExpense.id, input);
      setEditingExpense(null);
    } else {
      await add(input);
    }
    await refreshSummary();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this expense?")) return;
    await remove(id);
    if (editingExpense?.id === id) setEditingExpense(null);
    await refreshSummary();
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Daily Expense Tracker</h1>
      </header>

      <main className="app-main">
        <aside className="app-sidebar">
          <div className="card">
            <ExpenseForm
              editingExpense={editingExpense}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditingExpense(null)}
            />
          </div>
          <div className="card">
            <SummaryPanel summary={summary} loading={summaryLoading} />
          </div>
        </aside>

        <section className="app-content">
          <div className="card">
            <FiltersBar filters={filters} onChange={setFilters} />
            {error && <p className="form-error">{error}</p>}
            <ExpenseList
              data={data}
              loading={loading}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
