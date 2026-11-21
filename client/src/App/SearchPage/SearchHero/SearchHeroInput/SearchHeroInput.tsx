import type { FC } from "react";
import { SearchField } from "~/App/SearchPage/_components/SearchField/SearchField";
import { usePresenter } from "./_logic/usePresenter";

// The search field of the hero. It is not focused on start: focusing it opens the results screen.
export const SearchHeroInput: FC = () => {
    const { onOpen, handleTouchEnd } = usePresenter();

    return (
        <SearchField
            onFocus={onOpen}
            onTouchEnd={handleTouchEnd}
            // The field hands the focus on at once; iOS would draw its caret flying away.
            caretColor="transparent"
            viewTransitionName="search-field"
        />
    );
};
