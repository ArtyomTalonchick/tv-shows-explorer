import { useQueryStore } from "../_stores/useQueryStore";
import { SEARCH_FIELD_ID } from "../constants";

export type UseSearchQueryResult = {
    value: string;
    // Spaces around the query are not sent; a blank field counts as empty.
    trimmed: string;
    handleChange: (value: string) => void;
    // Empties the field and gives it the focus back, so the next query can be typed at once.
    clear: () => void;
};

// The search field: what it holds and the query that goes to the server.
export const useSearchQuery = (): UseSearchQueryResult => {
    const value = useQueryStore((state) => state.value);
    const setValue = useQueryStore((state) => state.setValue);
    const clearValue = useQueryStore((state) => state.clear);

    // The × button and «Clear search» both use it.
    const clear = (): void => {
        clearValue();
        document.getElementById(SEARCH_FIELD_ID)?.focus();
    };

    return { value, trimmed: value.trim(), handleChange: setValue, clear };
};
