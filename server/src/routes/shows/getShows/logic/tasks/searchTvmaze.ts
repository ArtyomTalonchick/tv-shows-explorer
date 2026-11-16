import { fetchJson } from "@/lib/tasks/fetchJson";
import type { Show } from "@tv-shows-explorer/shared";
import { dropExpiredSearches } from "./dropExpiredSearches";
import { readCachedSearch } from "./readCachedSearch";
import { writeCachedSearch } from "./writeCachedSearch";

const TVMAZE_API = "https://api.tvmaze.com";

// The fields of a TVmaze show the app reads: https://www.tvmaze.com/api#show-search
type TvmazeSearchResult = {
    show: {
        id: number;
        name: string;
        genres: string[];
        rating: { average: number | null } | null;
        premiered: string | null;
        ended: string | null;
        image: { medium: string; original: string } | null;
        url: string;
    };
};

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
    const shows = results.map(({ show }) => ({
        id: show.id,
        name: show.name,
        genres: show.genres,
        rating: show.rating?.average ?? null,
        premiered: show.premiered,
        ended: show.ended,
        image: show.image?.medium ?? null,
        url: show.url,
    }));
    dropExpiredSearches();
    writeCachedSearch(query, shows);
    return shows;
};
