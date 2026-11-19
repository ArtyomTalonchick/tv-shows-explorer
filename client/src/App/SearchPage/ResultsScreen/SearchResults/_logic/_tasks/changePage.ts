import { useSearchStore } from "@/stores/useSearchStore";
import { loadShows } from "@/tasks/search/loadShows";

// Shows another page of the found shows of the genre.
export const changePage = async (page: number): Promise<void> => {
    useSearchStore.setState({ page });
    await loadShows();
};
