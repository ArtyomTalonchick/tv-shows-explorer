import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { useRequest } from "@/lib/hooks/useRequest";
import { getSearchView } from "./getSearchView";
import { searchShows } from "./searchShows";

export const SEARCH_DEBOUNCE_MS = 400;

// The TVmaze request for a trimmed query: sent once typing stops, cancelled by the next one, repeated by Retry.
export const useShowsRequest = (query: string) => {
  const debounced = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const { latest, current, retry, reset } = useRequest(searchShows, debounced === "" ? null : debounced);

  // An emptied field drops the answer, so the next query starts from the skeletons again.
  if (query === "" && latest !== null) {
    reset();
  }

  return { ...getSearchView({ query, debounced, current, latest }), retry };
};
