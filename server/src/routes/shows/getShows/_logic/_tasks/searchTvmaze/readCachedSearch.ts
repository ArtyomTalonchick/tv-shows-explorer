import type { Show } from "@tv-shows-explorer/shared";
import { searchCache } from "~/routes/_stores/searchCache";
import { SEARCH_CACHE_TTL_MS } from "./constants";

// The shows saved for `query` if they are younger than 5 minutes; otherwise null, and TVmaze is to be asked.
export const readCachedSearch = (query: string): Show[] | null => {
    const cached = searchCache.get(query);
    if (cached === undefined || Date.now() - cached.savedAt >= SEARCH_CACHE_TTL_MS) {
        return null;
    }

    return cached.shows;
};
