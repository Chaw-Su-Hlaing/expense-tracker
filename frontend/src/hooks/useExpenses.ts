import { useCallback, useEffect, useState } from "react";
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from "../api/expenses";
import type { Expense, ExpenseFilters, ExpenseInput, PagedResponse } from "../types/expense";
import { extractErrorMessage } from "../utils/errors";

const EMPTY_PAGE: PagedResponse<Expense> = {
  content: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  last: true,
};

export function useExpenses(filters: ExpenseFilters) {
  const [data, setData] = useState<PagedResponse<Expense>>(EMPTY_PAGE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchExpenses(filters);
      setData(result);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (input: ExpenseInput) => {
      await createExpense(input);
      await refresh();
    },
    [refresh],
  );

  const edit = useCallback(
    async (id: number, input: ExpenseInput) => {
      await updateExpense(id, input);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteExpense(id);
      await refresh();
    },
    [refresh],
  );

  return { data, loading, error, refresh, add, edit, remove };
}
