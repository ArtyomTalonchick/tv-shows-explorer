import { SEARCH_FIELD_ID } from "@/App/SearchPage/ResultsScreen/constants";
import { clearSearch } from "@/tasks/search/clearSearch";

export type ResultsEmptyProps = {
    query: string;
};

type UsePresenterResult = ResultsEmptyProps & {
    // «Clear search»: empties the field and gives it the focus back, as the × button does.
    onClear: () => void;
};

export const usePresenter = ({ query }: ResultsEmptyProps): UsePresenterResult => {
    const clear = (): void => {
        clearSearch();
        document.getElementById(SEARCH_FIELD_ID)?.focus();
    };

    return { query, onClear: clear };
};
