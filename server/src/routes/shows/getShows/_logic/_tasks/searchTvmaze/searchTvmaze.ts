import { fetchJson, type Show } from "@tv-shows-explorer/shared";
import { TVMAZE_API } from "~/routes/constants";
import { toShow } from "~/tasks/tvmaze/toShow";
import { dropExpiredSearches } from "./dropExpiredSearches";
import { readCachedSearch } from "./readCachedSearch";
import { searchResultsSchema } from "./searchResultsSchema";
import { writeCachedSearch } from "./writeCachedSearch";

// Searches TVmaze, which returns all its results (at most 10) at once. An answer younger than 5 minutes comes from
// the cache, without TVmaze. Rejects on a network error, a non-2xx answer, an answer that is not search results, or
// when `signal` aborts; a failed answer is not cached, so Retry asks TVmaze again.
export const searchTvmaze = async (query: string, signal: AbortSignal): Promise<Show[]> => {
    const cached = readCachedSearch(query);
    if (cached !== null) {
        return cached;
    }

    const results = await fetchJson(`${TVMAZE_API}/search/shows?q=${encodeURIComponent(query)}`, searchResultsSchema, {
        signal,
    });
    const shows = results.map(({ show }) => toShow(show));
    dropExpiredSearches();
    writeCachedSearch(query, shows);
    return shows;
};
