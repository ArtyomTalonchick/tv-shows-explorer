import type { ResultsScreenProps } from "../ResultsScreen/ResultsScreen";
import type { SearchHeroProps } from "../SearchHero/SearchHero";
import { useDebouncedQuery } from "./useDebouncedQuery";
import { useScreenSwap } from "./useScreenSwap";
import { useSearchQuery } from "./useSearchQuery";
import { useShowsParams } from "./useShowsParams";
import { useShowsRequest } from "./useShowsRequest";

type UsePresenterResult = {
  isStart: boolean;
  hero: SearchHeroProps;
  results: ResultsScreenProps;
};

// Joins the field, its query once typing stops, what it asks the server for, the request and the screen swap.
// Typing and clearing stay on the results screen.
export const usePresenter = (): UsePresenterResult => {
  const { value, trimmed, handleChange, clear } = useSearchQuery();
  const debounced = useDebouncedQuery(trimmed);
  const { params, selectGenre, changePage } = useShowsParams(debounced);
  const { status, result, genre, page, shownQuery, isLoading, retry } = useShowsRequest(trimmed, params);
  const { isStart, isSwapping, open, goHome } = useScreenSwap(clear);

  return {
    isStart,
    hero: { query: value, onQueryChange: handleChange, onOpen: open },
    results: {
      query: value,
      shownQuery,
      status,
      result,
      genre,
      page,
      isLoading,
      caretHidden: isSwapping,
      onQueryChange: handleChange,
      onClear: clear,
      onRetry: retry,
      onGenreSelect: selectGenre,
      onPageChange: changePage,
      onHome: goHome,
    },
  };
};
