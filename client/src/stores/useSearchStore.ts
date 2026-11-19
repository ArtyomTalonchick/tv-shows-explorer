import type { ShowsPage } from "@tv-shows-explorer/shared";
import { create } from "zustand";

// The server's answer to a search for `query`: a page of the found shows, or `failed` and no page.
export type SearchAnswer = {
    query: string;
    data: ShowsPage | null;
    failed: boolean;
};

type SearchState = {
    // What the search field holds, as typed: the hero's field and the results screen's field are one field.
    value: string;
    // What the results ask the server for: the trimmed query once typing has stopped ("" for none), and the genre and
    // the page chosen for it.
    query: string;
    genre: string | null;
    page: number;
    // The request on its way, `null` once it has answered. A newer request replaces it, and its answer is dropped.
    request: AbortController | null;
    // The last answer. Found shows stay here while the next request loads; an empty or failed answer does not.
    answer: SearchAnswer | null;
    setValue: (value: string) => void;
    // Forgets the search; the field keeps what it holds.
    reset: () => void;
    // Empties the field and forgets the search.
    clear: () => void;
};

const NO_SEARCH = { query: "", genre: null, page: 1, request: null, answer: null } satisfies Partial<SearchState>;

export const useSearchStore = create<SearchState>()((set) => ({
    value: "",
    ...NO_SEARCH,
    setValue: (value) => set({ value }),
    reset: () => set(NO_SEARCH),
    clear: () => set({ value: "", ...NO_SEARCH }),
}));
