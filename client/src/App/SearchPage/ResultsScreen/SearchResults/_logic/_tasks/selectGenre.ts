import { useSearchStore } from "@/stores/useSearchStore";
import { loadShows } from "@/tasks/search/loadShows";

// Shows the found shows of a genre from page 1. The selected genre again resets the filter, as «All» does.
export const selectGenre = async (next: string | null): Promise<void> => {
    const { genre } = useSearchStore.getState();
    useSearchStore.setState({ genre: next === genre ? null : next, page: 1 });
    await loadShows();
};
