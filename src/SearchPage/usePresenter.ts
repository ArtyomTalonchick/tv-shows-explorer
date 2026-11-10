import { withViewTransition } from "@/lib/helpers/withViewTransition";
import { useSearchQuery } from "./useSearchQuery";
import { useShowsRequest } from "./useShowsRequest";

export const usePresenter = () => {
  const { value, trimmed, isEmpty, handleChange, clear } = useSearchQuery();
  const { status, shows, shownQuery, isLoading, retry } = useShowsRequest(trimmed);

  // Swapping the start hero and the results screen is animated; typing within one of them is not.
  const changeQuery = (next: string) => {
    const staysEmpty = next.trim() === "";
    if (staysEmpty === isEmpty) {
      handleChange(next);
    } else {
      withViewTransition(() => handleChange(next));
    }
  };

  return {
    // The hero is shown until the field holds a query.
    isStart: isEmpty,
    query: value,
    // The results area names the query of the shown results, which may lag behind the field.
    shownQuery,
    status,
    shows,
    isLoading,
    changeQuery,
    clear: () => withViewTransition(clear),
    retry,
  };
};
