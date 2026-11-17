import type { ShowsPage, ShowsQuery } from "@tv-shows-explorer/shared";
import type { RequestAnswer } from "@/lib/request/useRequest";
import type { SearchStatus, SearchView } from "./types";

type ShowsAnswer = RequestAnswer<ShowsQuery, ShowsPage>;

type SearchViewInput = {
    // The query in the field, trimmed.
    query: string;
    // What the request was sent for: the query once typing stopped, its genre and page.
    params: ShowsQuery | null;
    // The answer to `params`, once it has arrived.
    current: ShowsAnswer | null;
    // The last answer, to these params or to earlier ones.
    latest: ShowsAnswer | null;
};

export const getSearchView = ({ query, params, current, latest }: SearchViewInput): SearchView => {
    // The answer to the query as it is now.
    const answer = query !== "" && params !== null && params.query === query ? current : null;
    // Found shows stay on screen while the next request waits and loads; an empty or failed answer does not.
    const kept = latest !== null && latest.data !== null && latest.data.found > 0 ? latest : null;
    // An empty field shows nothing.
    const shown = query === "" ? null : (answer ?? kept);
    const result = shown?.data ?? null;

    const status = ((): SearchStatus => {
        if (shown === null) {
            return query === "" ? "idle" : "loading";
        }
        if (result === null) {
            return "error";
        }
        return result.found > 0 ? "results" : "empty";
    })();

    // Another genre or page of the shown query, asked and not answered yet.
    const asked = answer === null && params !== null && params.query === shown?.params.query ? params : null;
    const marked = asked ?? result ?? { genre: null, page: 1 };

    return {
        status,
        result,
        genre: marked.genre,
        page: marked.page,
        shownQuery: shown?.params.query ?? query,
        isLoading: query !== "" && answer === null,
    };
};
