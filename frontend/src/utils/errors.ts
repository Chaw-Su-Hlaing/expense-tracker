import { isAxiosError } from "axios";
import type { ApiError } from "../types/expense";

export function extractErrorMessage(error: unknown): string {
  if (isAxiosError<ApiError>(error)) {
    const data = error.response?.data;
    if (data?.fieldErrors) {
      return Object.values(data.fieldErrors).join(", ");
    }
    if (data?.message) {
      return data.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
}
