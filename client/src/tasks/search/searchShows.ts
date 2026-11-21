import type { ShowsPage, ShowsQuery } from "@tv-shows-explorer/shared";
import { fetchJson } from "~/lib/http/fetchJson";
import { API_URL } from "~/tasks/constants";

// Asks the app's server for a page of the found shows of a genre. Rejects on a network error, a non-2xx answer, or
// when `signal` aborts.
export const searchShows = async ({ query, genre, page }: ShowsQuery, signal: AbortSignal): Promise<ShowsPage> => {
    const search = new URLSearchParams({ q: query, page: String(page) });
    if (genre !== null) {
        search.set("genre", genre);
    }

    return await fetchJson<ShowsPage>(`${API_URL}/shows?${search}`, { signal });
};
