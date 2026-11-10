import { withViewTransition } from "@/lib/helpers/withViewTransition";
import { useSearchQuery } from "./useSearchQuery";
import { useShowsRequest, type UseShowsRequestResult } from "./useShowsRequest";

// The results area names `shownQuery`, the query of the shown results, which may lag behind the field.
type UsePresenterResult = UseShowsRequestResult & {
  // The hero is shown until the field holds a query.
  isStart: boolean;
  query: string;
  changeQuery: (next: string) => void;
  clear: () => void;
};

export const usePresenter = (): UsePresenterResult => {
  const { value, trimmed, isEmpty, handleChange, clear } = useSearchQuery();
  const { status, shows, shownQuery, isLoading, retry } = useShowsRequest(trimmed);

  // Swapping the start hero and the results screen is animated; typing within one of them is not.
  const changeQuery = (next: string): void => {
    const staysEmpty = next.trim() === "";
    if (staysEmpty === isEmpty) {
      handleChange(next);
    } else {
      withViewTransition(() => handleChange(next));
    }
  };

  return {
    isStart: isEmpty,
    query: value,
    shownQuery,
    status,
    shows,
    isLoading,
    changeQuery,
    clear: () => withViewTransition(clear),
    retry,
  };
};
