import { useSearchStore } from "~/stores/useSearchStore";
import { loadShows } from "~/tasks/search/loadShows";

// Shows another page of the found shows of the genre. The page is marked at once; if it fails to load, the shown page
// comes back, and the task rejects as `loadShows` does.
export const changePage = async (page: number): Promise<void> => {
    useSearchStore.setState({ page });
    await loadShows({ keepShown: true });
};
