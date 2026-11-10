import { useRef } from "react";
import type { SearchStatus, Show } from "@/SearchPage/types";
import type { SearchBarProps } from "./SearchBar/SearchBar";
import type { SearchResultsProps } from "./SearchResults/SearchResults";

export type ResultsScreenProps = {
  query: string;
  // The query of the shown results; the field may already hold the next one.
  shownQuery: string;
  status: SearchStatus;
  shows: Show[];
  isLoading: boolean;
  // While the screens swap.
  caretHidden: boolean;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  onRetry: () => void;
  // The logo: back to the start screen.
  onHome: () => void;
};

type UsePresenterResult = {
  searchBar: SearchBarProps;
  searchResults: SearchResultsProps;
};

export const usePresenter = ({
  query,
  shownQuery,
  status,
  shows,
  isLoading,
  caretHidden,
  onQueryChange,
  onClear,
  onRetry,
  onHome,
}: ResultsScreenProps): UsePresenterResult => {
  const inputRef = useRef<HTMLInputElement>(null);

  // The × button and «Clear search» both give the focus back to the field, so the next query can be typed at once.
  const clear = (): void => {
    onClear();
    inputRef.current?.focus();
  };

  return {
    searchBar: {
      query,
      isLoading,
      caretColor: caretHidden ? "transparent" : undefined,
      inputRef,
      onQueryChange,
      onClear: clear,
      onHome,
    },
    searchResults: { status, query: shownQuery, shows, onRetry, onClear: clear },
  };
};
