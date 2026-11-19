import { useSearchStore } from "@/stores/useSearchStore";

// Empties the field and forgets the search: the request on its way is cancelled, and the results are idle again.
export const clearSearch = (): void => {
    const { request, clear } = useSearchStore.getState();
    request?.abort();
    clear();
};
