import type { ShowsPage } from "@tv-shows-explorer/shared";
import type { SearchStatus } from "@/SearchPage/types";
import type { GenreFilterProps } from "../GenreFilter/GenreFilter";
import type { ResultsHeadProps } from "../ResultsHead/ResultsHead";
import type { ResultsListProps } from "../ResultsList/ResultsList";

export type SearchResultsProps = {
  status: SearchStatus;
  query: string;
  // The answer on screen.
  result: ShowsPage | null;
  // The genre and the page to mark: the asked ones, before their answer comes.
  genre: string | null;
  page: number;
  // A request is on its way; the shown results wait for it.
  isLoading: boolean;
  onRetry: () => void;
  onClear: () => void;
  onGenreSelect: (genre: string | null) => void;
  onPageChange: (page: number) => void;
};

type UsePresenterResult = Pick<SearchResultsProps, "query" | "onRetry" | "onClear"> & {
  // «Shows for “dark”» with «9 shows», or «4 of 9 shows · Drama» for a genre; hidden with an empty field.
  head: ResultsHeadProps | null;
  // Hidden when no found show has a genre.
  genreFilter: GenreFilterProps | null;
  list: ResultsListProps | null;
  // The shown results wait for the next answer: dimmed, and nothing in them can be pressed.
  isBusy: boolean;
  isIdle: boolean;
  isLoading: boolean;
  isEmpty: boolean;
  isError: boolean;
};

export const usePresenter = ({
  status,
  query,
  result,
  genre,
  page,
  isLoading,
  onRetry,
  onClear,
  onGenreSelect,
  onPageChange,
}: SearchResultsProps): UsePresenterResult => {
  const shown = status === "results" ? result : null;

  const countLabel = ((): string | null => {
    if (status === "empty") {
      return "0 shows";
    }
    if (shown === null) {
      return null;
    }
    const all = `${shown.found} ${shown.found === 1 ? "show" : "shows"}`;
    if (shown.genre === null) {
      return all;
    }
    return `${shown.total} of ${all} · ${shown.genre}`;
  })();

  const genreFilter: GenreFilterProps | null =
    shown !== null && shown.genres.length > 0
      ? { genres: shown.genres, total: shown.found, selected: genre, onSelect: onGenreSelect }
      : null;
  const list: ResultsListProps | null =
    shown === null ? null : { shows: shown.shows, page, perPage: shown.perPage, total: shown.total, onPageChange };
  const trimmed = query.trim();

  return {
    query: trimmed,
    head: status === "idle" ? null : { query: trimmed, count: countLabel },
    genreFilter,
    list,
    isBusy: shown !== null && isLoading,
    isIdle: status === "idle",
    isLoading: status === "loading",
    isEmpty: status === "empty",
    isError: status === "error",
    onRetry,
    onClear,
  };
};
