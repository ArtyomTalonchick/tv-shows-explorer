import type { ShowsPage } from "@tv-shows-explorer/shared";
import type { SearchAnswer } from "@/stores/useSearchStore";

export type SearchStatus = "idle" | "loading" | "results" | "empty" | "error";

type SearchViewInput = {
    // What the field holds, as typed.
    value: string;
    // What was asked of the server: the query once typing stopped, its genre and page.
    query: string;
    genre: string | null;
    page: number;
    // A request is on its way.
    waiting: boolean;
    // The last answer, to these params or to earlier ones.
    answer: SearchAnswer | null;
};

// What the results area shows for the query in the field.
export type SearchView = {
    status: SearchStatus;
    // The answer on screen: a page of the found shows, the genres and the counts; `null` with nothing found shown.
    result: ShowsPage | null;
    // The genre and the page the filter and the pages mark. Another genre or page of the shown query is marked as
    // soon as it is asked, before its answer.
    genre: string | null;
    page: number;
    // The query the shown answer belongs to; the query being typed while there is none.
    shownQuery: string;
    // The query in the field has no answer yet: typing has not stopped, or its request is on its way.
    isLoading: boolean;
};

export const getSearchView = ({ value, query, genre, page, waiting, answer }: SearchViewInput): SearchView => {
    const typed = value.trim();
    const pending = typed !== query || waiting;
    // Found shows stay on screen while the next request waits and loads; an empty or failed answer does not.
    const kept = answer !== null && answer.data !== null && answer.data.found > 0;
    // An empty field shows nothing.
    const shown = typed === "" || (pending && !kept) ? null : answer;
    const result = shown?.data ?? null;

    const status = ((): SearchStatus => {
        if (shown === null) {
            return typed === "" ? "idle" : "loading";
        }
        if (result === null) {
            return "error";
        }
        return result.found > 0 ? "results" : "empty";
    })();

    // Another genre or page of the shown query, asked and not answered yet.
    const asked = pending && shown !== null && shown.query === query ? { genre, page } : null;
    const marked = asked ?? result ?? { genre: null, page: 1 };

    return {
        status,
        result,
        genre: marked.genre,
        page: marked.page,
        shownQuery: shown?.query ?? typed,
        isLoading: typed !== "" && pending,
    };
};
