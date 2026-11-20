import { useRef } from "react";
import { clearSearch } from "@/tasks/search/clearSearch";
import type { SearchBarProps } from "../SearchBar/SearchBar";
import type { SearchResultsProps } from "../SearchResults/SearchResults";

type UsePresenterResult = {
    searchBar: SearchBarProps;
    results: SearchResultsProps;
};

export const usePresenter = (): UsePresenterResult => {
    const fieldRef = useRef<HTMLInputElement>(null);

    // The × of the field and «Clear search» of the empty results: empties the field, forgets the search and gives the
    // field the focus back.
    const clear = (): void => {
        clearSearch();
        fieldRef.current?.focus();
    };

    return {
        searchBar: { fieldRef, onClear: clear },
        results: { onClear: clear },
    };
};
