import { useSearchStore } from "@/stores/useSearchStore";
import { clearSearch } from "@/tasks/search/clearSearch";
import { SEARCH_FIELD_ID } from "@/App/SearchPage/constants";

type UsePresenterResult = {
    // The query nothing was found for.
    query: string;
    // «Clear search»: empties the field and gives it the focus back, as the × button does.
    onClear: () => void;
};

export const usePresenter = (): UsePresenterResult => {
    const query = useSearchStore((state) => state.answer?.query ?? "");

    const handleClear = (): void => {
        clearSearch();
        document.getElementById(SEARCH_FIELD_ID)?.focus();
    };

    return { query, onClear: handleClear };
};
