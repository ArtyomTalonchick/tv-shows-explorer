import { useSearchStore } from "@/stores/useSearchStore";

// Keeps what the field holds. A field emptied, or left with spaces only, stops the search at once: the request on its
// way is cancelled and the results are idle, so the same query typed back is a new search, not the old answer kept.
export const changeQuery = (value: string): void => {
    const { request, forgetSearch } = useSearchStore.getState();
    useSearchStore.setState({ value });

    if (value.trim() === "") {
        request?.abort();
        forgetSearch();
    }
};
