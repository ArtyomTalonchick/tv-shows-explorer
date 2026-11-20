import { useSearchStore } from "@/stores/useSearchStore";
import { searchShows } from "./searchShows";

type LoadShowsOptions = {
    // A failure keeps the found shows on screen and brings back their genre and page, and the task rejects, so the
    // caller can say so: another genre or page that did not load. Without it, or with no found shows on screen, a
    // failure is kept as a failed answer, which the results show with Retry, and the task does not reject.
    keepShown?: boolean;
};

// Asks the server for the query, the genre and the page of the search store, and keeps the answer there. The latest
// call wins: it cancels the request on its way, and an answer to a request no longer current is dropped. Found shows
// stay on screen while it loads; an empty or failed answer does not.
export const loadShows = async ({ keepShown = false }: LoadShowsOptions = {}): Promise<void> => {
    const { query, genre, page, request, answer } = useSearchStore.getState();
    request?.abort();

    const controller = new AbortController();
    const kept = answer !== null && answer.data !== null && answer.data.found > 0 ? answer : null;
    useSearchStore.setState({ request: controller, isLoading: true, answer: kept });

    const isCurrent = (): boolean => useSearchStore.getState().request === controller;

    try {
        const data = await searchShows({ query, genre, page }, controller.signal);
        if (isCurrent()) {
            useSearchStore.setState({ request: null, isLoading: false, answer: { query, data, failed: false } });
        }
    } catch (error) {
        if (!isCurrent()) {
            return;
        }
        if (keepShown && kept?.data) {
            useSearchStore.setState({
                request: null,
                isLoading: false,
                genre: kept.data.genre,
                page: kept.data.page,
            });
            throw error;
        }
        useSearchStore.setState({ request: null, isLoading: false, answer: { query, data: null, failed: true } });
    }
};
