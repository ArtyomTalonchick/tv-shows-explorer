import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";

export const SEARCH_DEBOUNCE_MS = 400;

// The trimmed query once typing has stopped for 400 ms. An emptied field passes at once: the same query typed back
// is then a new request, not the old one kept.
export const useDebouncedQuery = (query: string): string => {
  return useDebouncedValue(query, query === "" ? 0 : SEARCH_DEBOUNCE_MS);
};
