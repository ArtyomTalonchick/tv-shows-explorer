import { useSearchStore } from "~/stores/useSearchStore";
import { loadShows } from "~/tasks/search/loadShows";

// Searches for what the field holds, trimmed; the genre and the page start over. Called once typing has stopped, so
// it reads the field as it is then. An empty field asks nothing, and so does the query already searched for, unless
// its answer was dropped while typing (`changeQuery`) and no request is on its way.
export const searchQuery = async (): Promise<void> => {
    const { value, query, answer, isLoading } = useSearchStore.getState();
    const next = value.trim();
    const answered = answer !== null || isLoading;
    const asked = next === query && answered;
    if (next === "" || asked) {
        return;
    }

    useSearchStore.setState({ query: next, genre: null, page: 1 });
    await loadShows();
};
