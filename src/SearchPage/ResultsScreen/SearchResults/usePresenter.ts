import type { SearchStatus, Show } from "@/SearchPage/types";
import type { GenreFilterProps } from "./GenreFilter/GenreFilter";
import { useGenreFilter } from "./useGenreFilter";

export type SearchResultsProps = {
  status: SearchStatus;
  query: string;
  shows: Show[];
  onRetry: () => void;
  onClear: () => void;
};

export const usePresenter = ({ status, query, shows, onRetry, onClear }: SearchResultsProps) => {
  const { genre, genres, filteredShows, select } = useGenreFilter(shows);
  const hasResults = status === "results";

  // «9 shows», or «4 of 9 shows · Drama» while a genre is selected.
  const countLabel = ((): string | null => {
    if (status === "empty") {
      return "0 shows";
    }
    if (!hasResults) {
      return null;
    }
    const all = `${shows.length} ${shows.length === 1 ? "show" : "shows"}`;
    if (genre === null) {
      return all;
    }
    return `${filteredShows.length} of ${all} · ${genre}`;
  })();

  // Hidden when no show of the results has a genre.
  const genreFilter: GenreFilterProps | null =
    hasResults && genres.length > 0 ? { genres, total: shows.length, selected: genre, onSelect: select } : null;

  return {
    query: query.trim(),
    countLabel,
    genreFilter,
    isLoading: status === "loading",
    isEmpty: status === "empty",
    isError: status === "error",
    hasResults,
    shows: filteredShows,
    onRetry,
    onClear,
  };
};
