import type { ShowsPage } from "@tv-shows-explorer/shared";
import { useSearchStore } from "@/stores/useSearchStore";
import { searchShows } from "./searchShows";

// Asks the server for the query, the genre and the page of the search store, and keeps the answer there. The latest
// call wins: it cancels the request on its way, and an answer to a request no longer current is dropped. Found shows
// stay on screen while it loads; an empty or failed answer does not. A failure is kept as a failed answer, which the
// results show with Retry, so the task does not reject.
export const loadShows = async (): Promise<void> => {
    const { query, genre, page, request, answer } = useSearchStore.getState();
    request?.abort();

    const controller = new AbortController();
    const kept = answer !== null && answer.data !== null && answer.data.found > 0 ? answer : null;
    useSearchStore.setState({ request: controller, answer: kept });

    const settle = (data: ShowsPage | null): void => {
        if (useSearchStore.getState().request === controller) {
            useSearchStore.setState({ request: null, answer: { query, data, failed: data === null } });
        }
    };

    try {
        settle(await searchShows({ query, genre, page }, controller.signal));
    } catch {
        settle(null);
    }
};
