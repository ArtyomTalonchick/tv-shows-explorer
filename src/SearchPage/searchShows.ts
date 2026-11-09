import type { Show } from "./types";

const SEARCH_URL = "https://api.tvmaze.com/search/shows";

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

// Searches TVmaze. Rejects on a network error, a non-2xx answer, or when `signal` aborts.
export const searchShows = async (query: string, signal: AbortSignal): Promise<Show[]> => {
  const response = await fetch(`${SEARCH_URL}?q=${encodeURIComponent(query)}`, { signal });
  if (!response.ok) {
    throw new Error(`TVmaze answered ${response.status}`);
  }

  const results = (await response.json()) as TvmazeSearchResult[];
  return results.map(({ show }) => ({
    id: show.id,
    name: show.name,
    genres: show.genres,
    rating: show.rating?.average ?? null,
    premiered: show.premiered,
    ended: show.ended,
    image: show.image?.medium ?? null,
    url: show.url,
  }));
};
