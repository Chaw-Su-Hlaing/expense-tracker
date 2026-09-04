import { useCallback, useEffect, useState } from "react";
import { fetchSummary } from "../api/expenses";
import type { Summary } from "../types/expense";
import { extractErrorMessage } from "../utils/errors";

export function useSummary(month?: string) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSummary(month);
      setSummary(result);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { summary, loading, error, refresh };
}
