import { useSearchStore } from "~/stores/useSearchStore";
import { hasShows } from "~/tasks/search/hasShows";

// Keeps what the field holds. A field emptied, or left with spaces only, stops the search at once: the request on its
// way is cancelled and the results are idle, so the same query typed back is a new search, not the old answer kept.
// Another query drops an empty or a failed answer at once: the results load until typing stops and the query is
// asked. Found shows stay, dimmed, until the new answer.
export const changeQuery = (value: string): void => {
    const { request, query, answer, forgetSearch } = useSearchStore.getState();
    const typed = value.trim();
    useSearchStore.setState({ value });

    if (typed === "") {
        request?.abort();
        forgetSearch();
        return;
    }

    if (typed !== query && !hasShows(answer)) {
        useSearchStore.setState({ answer: null });
    }
};
