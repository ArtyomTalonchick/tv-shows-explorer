import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { searchShows } from "./searchShows";
import type { SearchStatus, Show } from "./types";

export const SEARCH_DEBOUNCE_MS = 400;

// The answer to one request. `key` names the request, so an answer to an older one is never shown;
// `query` is the query it answers.
type Outcome = { key: string; query: string; shows: Show[] } | { key: string; query: string; failed: true };

// The TVmaze request for a trimmed query: debounce, one request at a time, Retry.
export const useShowsRequest = (query: string) => {
  const [attempt, setAttempt] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const debounced = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const key = `${attempt}:${debounced}`;

  // An emptied field drops the answer, so the next query starts from the skeletons again.
  if (query === "" && outcome !== null) {
    setOutcome(null);
  }

  useEffect(() => {
    if (!debounced) {
      return;
    }

    // A new query or a Retry runs the cleanup first: the previous request is cancelled,
    // and its answer, if it still arrives, is dropped.
    const controller = new AbortController();
    const load = async () => {
      try {
        const shows = await searchShows(debounced, controller.signal);
        if (!controller.signal.aborted) {
          setOutcome({ key, query: debounced, shows });
        }
      } catch {
        if (!controller.signal.aborted) {
          setOutcome({ key, query: debounced, failed: true });
        }
      }
    };
    void load();

    return () => controller.abort();
  }, [debounced, key]);

  // The answer to the query as it is now.
  const current = query !== "" && query === debounced && outcome?.key === key ? outcome : null;
  // Found shows stay on screen while the next query waits and loads; an empty or failed answer does not.
  const kept = query !== "" && outcome && "shows" in outcome && outcome.shows.length > 0 ? outcome : null;
  const shown = current ?? kept;

  const status = ((): SearchStatus => {
    if (query === "") {
      return "idle";
    }
    if (shown && "failed" in shown) {
      return "error";
    }
    if (shown) {
      return shown.shows.length > 0 ? "results" : "empty";
    }
    return "loading";
  })();

  return {
    status,
    shows: shown && "shows" in shown ? shown.shows : [],
    // The query the shown answer belongs to; the query being loaded while there is none.
    shownQuery: shown?.query ?? query,
    // The request for the query as it is now has not answered yet.
    isLoading: query !== "" && current === null,
    retry: () => setAttempt((n) => n + 1),
  };
};
