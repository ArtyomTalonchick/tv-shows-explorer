import type { Show } from "@tv-shows-explorer/shared";
import { TVMAZE_API } from "~/routes/constants";
import { toShow } from "~/tasks/toShow";
import { fetchJson } from "~/lib/http/fetchJson";
import type { TvmazeShow } from "~/tasks/types";
import { dropExpiredSearches } from "./dropExpiredSearches";
import { readCachedSearch } from "./readCachedSearch";
import { writeCachedSearch } from "./writeCachedSearch";

// One result of a TVmaze search: https://www.tvmaze.com/api#show-search
type TvmazeSearchResult = { show: TvmazeShow };

// Searches TVmaze, which returns all its results (at most 10) at once. An answer younger than 5 minutes comes from
// the cache, without TVmaze. Rejects on a network error, a non-2xx answer, or when `signal` aborts; a failed answer
// is not cached, so Retry asks TVmaze again.
export const searchTvmaze = async (query: string, signal: AbortSignal): Promise<Show[]> => {
    const cached = readCachedSearch(query);
    if (cached !== null) {
        return cached;
    }

    const results = await fetchJson<TvmazeSearchResult[]>(
        `${TVMAZE_API}/search/shows?q=${encodeURIComponent(query)}`,
        signal,
    );
    const shows = results.map(({ show }) => toShow(show));
    dropExpiredSearches();
    writeCachedSearch(query, shows);
    return shows;
};
