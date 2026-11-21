import { useSearchStore } from "~/stores/useSearchStore";
import { loadShows } from "~/tasks/search/loadShows";

// Shows the found shows of a genre from page 1. The selected genre again resets the filter, as «All» does. The genre
// is marked at once; if its shows fail to load, the shown genre and page come back, and the task rejects as
// `loadShows` does.
export const selectGenre = async (next: string | null): Promise<void> => {
    const { genre } = useSearchStore.getState();
    useSearchStore.setState({ genre: next === genre ? null : next, page: 1 });
    await loadShows({ keepShown: true });
};
