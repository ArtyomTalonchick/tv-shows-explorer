import type { ShowsPage } from "@tv-shows-explorer/shared";

export type SearchStatus = "idle" | "loading" | "results" | "empty" | "error";

// What the results area shows for the query in the field.
export type SearchView = {
    status: SearchStatus;
    // The answer on screen: a page of the found shows, the genres and the counts; `null` with nothing found shown.
    result: ShowsPage | null;
    // The genre and the page the filter and the pages mark. Another genre or page of the shown query is marked as
    // soon as it is asked, before its answer.
    genre: string | null;
    page: number;
    // The query the shown answer belongs to; the query being loaded while there is none.
    shownQuery: string;
    // The request for the query as it is now has not answered yet.
    isLoading: boolean;
};
