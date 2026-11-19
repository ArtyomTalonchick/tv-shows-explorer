import { useSearchStore } from "@/stores/useSearchStore";
import { loadShows } from "@/tasks/search/loadShows";

// Searches for what the field holds, trimmed; the genre and the page start over. Called once typing has stopped, so
// it reads the field as it is then. An empty field, or the query already searched for, asks nothing.
export const searchQuery = async (): Promise<void> => {
    const { value, query } = useSearchStore.getState();
    const next = value.trim();
    if (next === "" || next === query) {
        return;
    }

    useSearchStore.setState({ query: next, genre: null, page: 1 });
    await loadShows();
};
