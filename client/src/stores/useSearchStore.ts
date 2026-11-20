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
    // Only tasks use it.
    request: AbortController | null;
    // A request is on its way: what the results read instead of `request`.
    isLoading: boolean;
    // The answer on screen. Found shows stay here while the next query waits and loads; an empty or failed answer
    // goes as soon as the field changes or the next request starts.
    answer: SearchAnswer | null;
    // Forgets the search; the field keeps what it holds.
    forgetSearch: () => void;
};

const NO_SEARCH = {
    query: "",
    genre: null,
    page: 1,
    request: null,
    isLoading: false,
    answer: null,
} satisfies Partial<SearchState>;

export const useSearchStore = create<SearchState>()((set) => ({
    value: "",
    ...NO_SEARCH,
    forgetSearch: () => set(NO_SEARCH),
}));
