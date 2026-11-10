import type { RequestAnswer } from "@/lib/hooks/useRequest";
import type { SearchStatus, Show } from "./types";

type ShowsAnswer = RequestAnswer<string, Show[]>;

type SearchViewInput = {
  // The query in the field, trimmed.
  query: string;
  // The query the request was sent for.
  debounced: string;
  // The answer to the request for `debounced`, once it has arrived.
  current: ShowsAnswer | null;
  // The last answer, to this query or to an earlier one.
  latest: ShowsAnswer | null;
};

// What the results area shows for the query in the field.
export type SearchView = {
  status: SearchStatus;
  shows: Show[];
  // The query the shown answer belongs to; the query being loaded while there is none.
  shownQuery: string;
  // The request for the query as it is now has not answered yet.
  isLoading: boolean;
};

export const getSearchView = ({ query, debounced, current, latest }: SearchViewInput): SearchView => {
  // The answer to the query as it is now.
  const answer = query !== "" && query === debounced ? current : null;
  // Found shows stay on screen while the next query waits and loads; an empty or failed answer does not.
  const kept = latest !== null && latest.data !== null && latest.data.length > 0 ? latest : null;
  // An empty field shows nothing.
  const shown = query === "" ? null : (answer ?? kept);
  const shows = shown?.data ?? [];

  const status = ((): SearchStatus => {
    if (query === "") {
      return "idle";
    }
    if (shown === null) {
      return "loading";
    }
    if (shown.failed) {
      return "error";
    }
    return shows.length > 0 ? "results" : "empty";
  })();

  return {
    status,
    shows,
    shownQuery: shown?.params ?? query,
    isLoading: query !== "" && answer === null,
  };
};
