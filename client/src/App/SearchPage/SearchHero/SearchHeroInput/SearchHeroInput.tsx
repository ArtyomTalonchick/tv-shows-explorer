import type { FC } from "react";
import { SearchInput } from "@/lib/components/SearchInput/SearchInput";
import { SEARCH_LABEL, SEARCH_PLACEHOLDER } from "@/App/SearchPage/constants";
import { usePresenter } from "./_logic/usePresenter";

// The search field of the hero. It is not focused on start: focusing it opens the results screen.
export const SearchHeroInput: FC = () => {
    const { query, onQueryChange, onOpen, handleTouchEnd } = usePresenter();

    return (
        <SearchInput
            label={SEARCH_LABEL}
            placeholder={SEARCH_PLACEHOLDER}
            value={query}
            onChange={onQueryChange}
            onFocus={onOpen}
            onTouchEnd={handleTouchEnd}
            // The field hands the focus on at once; iOS would draw its caret flying away.
            caretColor="transparent"
            viewTransitionName="search-field"
        />
    );
};
