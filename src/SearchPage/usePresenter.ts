import type { ResultsScreenProps } from "./ResultsScreen/ResultsScreen";
import type { SearchHeroProps } from "./SearchHero/SearchHero";
import { useScreenSwap } from "./useScreenSwap";
import { useSearchQuery } from "./useSearchQuery";
import { useShowsRequest } from "./useShowsRequest";

type UsePresenterResult = {
  isStart: boolean;
  hero: SearchHeroProps;
  results: ResultsScreenProps;
};

// Joins the field, the request for its query and the screen swap. Typing and clearing stay on the results screen.
export const usePresenter = (): UsePresenterResult => {
  const { value, trimmed, handleChange, clear } = useSearchQuery();
  const { status, shows, shownQuery, isLoading, retry } = useShowsRequest(trimmed);
  const { isStart, isSwapping, open, goHome } = useScreenSwap(clear);

  return {
    isStart,
    hero: { query: value, onQueryChange: handleChange, onOpen: open },
    results: {
      query: value,
      shownQuery,
      status,
      shows,
      isLoading,
      caretHidden: isSwapping,
      onQueryChange: handleChange,
      onClear: clear,
      onRetry: retry,
      onHome: goHome,
    },
  };
};
