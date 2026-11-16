import { searchCache } from "@/stores/searchCache";
import { SEARCH_CACHE_TTL_MS } from "@/routes/shows/getShows/constants";

// Drops the entries 5 minutes old or older, so the cache holds no more than the queries of the last 5 minutes.
export const dropExpiredSearches = (): void => {
    const now = Date.now();
    searchCache.forEach((cached, key) => {
        if (now - cached.savedAt >= SEARCH_CACHE_TTL_MS) {
            searchCache.delete(key);
        }
    });
};
