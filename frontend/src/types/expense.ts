export type Category =
  | "FOOD"
  | "TRANSPORT"
  | "BILLS"
  | "ENTERTAINMENT"
  | "HEALTH"
  | "SHOPPING"
  | "EDUCATION"
  | "OTHER";

export const CATEGORIES: Category[] = [
  "FOOD",
  "TRANSPORT",
  "BILLS",
  "ENTERTAINMENT",
  "HEALTH",
  "SHOPPING",
  "EDUCATION",
  "OTHER",
];

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: Category;
  date: string;
  notes: string | null;
}

export interface ExpenseInput {
  title: string;
  amount: number;
  category: Category;
  date: string;
  notes: string | null;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface CategoryTotal {
  category: Category;
  total: number;
  percentage: number;
}

export interface Summary {
  date: string;
  todayTotal: number;
  month: string;
  monthTotal: number;
  categoryBreakdown: CategoryTotal[];
}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  category?: Category;
  page?: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  fieldErrors?: Record<string, string>;
}
