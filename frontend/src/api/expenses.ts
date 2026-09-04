import { apiClient } from "./client";
import type {
  Expense,
  ExpenseFilters,
  ExpenseInput,
  PagedResponse,
  Summary,
} from "../types/expense";

export async function fetchExpenses(
  filters: ExpenseFilters = {},
): Promise<PagedResponse<Expense>> {
  const { data } = await apiClient.get<PagedResponse<Expense>>("/expenses", {
    params: filters,
  });
  return data;
}

export async function fetchExpense(id: number): Promise<Expense> {
  const { data } = await apiClient.get<Expense>(`/expenses/${id}`);
  return data;
}

export async function createExpense(input: ExpenseInput): Promise<Expense> {
  const { data } = await apiClient.post<Expense>("/expenses", input);
  return data;
}

export async function updateExpense(
  id: number,
  input: ExpenseInput,
): Promise<Expense> {
  const { data } = await apiClient.put<Expense>(`/expenses/${id}`, input);
  return data;
}

export async function deleteExpense(id: number): Promise<void> {
  await apiClient.delete(`/expenses/${id}`);
}

export async function fetchSummary(month?: string): Promise<Summary> {
  const { data } = await apiClient.get<Summary>("/expenses/summary", {
    params: month ? { month } : {},
  });
  return data;
}
