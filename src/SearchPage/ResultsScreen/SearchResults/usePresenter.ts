import type { SearchStatus, Show } from "@/SearchPage/types";

export type SearchResultsProps = {
  status: SearchStatus;
  query: string;
  shows: Show[];
  onRetry: () => void;
  onClear: () => void;
};

export const usePresenter = ({ status, query, shows, onRetry, onClear }: SearchResultsProps) => {
  const trimmed = query.trim();
  const countLabel =
    status === "results"
      ? `${shows.length} ${shows.length === 1 ? "show" : "shows"}`
      : status === "empty"
        ? "0 shows"
        : null;

  return {
    query: trimmed,
    countLabel,
    isLoading: status === "loading",
    isEmpty: status === "empty",
    isError: status === "error",
    hasResults: status === "results",
    shows,
    onRetry,
    onClear,
  };
};
