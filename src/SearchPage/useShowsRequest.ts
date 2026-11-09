import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { searchShows } from "./searchShows";
import type { SearchStatus, Show } from "./types";

export const SEARCH_DEBOUNCE_MS = 400;

// The answer to one request. `key` names the request, so an answer to an older one is never shown.
type Outcome = { key: string; shows: Show[] } | { key: string; failed: true };

// The TVmaze request for a trimmed query: debounce, one request at a time, Retry.
export const useShowsRequest = (query: string) => {
  const [attempt, setAttempt] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const debounced = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const key = `${attempt}:${debounced}`;

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
          setOutcome({ key, shows });
        }
      } catch {
        if (!controller.signal.aborted) {
          setOutcome({ key, failed: true });
        }
      }
    };
    void load();

    return () => controller.abort();
  }, [debounced, key]);

  // The answer counts only when it belongs to the query as it is now.
  const current = query !== "" && query === debounced && outcome?.key === key ? outcome : null;

  const status = ((): SearchStatus => {
    if (query === "") {
      return "idle";
    }
    if (current && "failed" in current) {
      return "error";
    }
    if (current) {
      return current.shows.length > 0 ? "results" : "empty";
    }
    return "loading";
  })();

  return {
    status,
    shows: current && "shows" in current ? current.shows : [],
    retry: () => setAttempt((n) => n + 1),
  };
};
