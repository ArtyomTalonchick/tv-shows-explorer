import type { FC } from "react";
import { FocusKeeper } from "./FocusKeeper/FocusKeeper";
import { ResultsScreen } from "./ResultsScreen/ResultsScreen";
import { SearchHero } from "./SearchHero/SearchHero";
import { usePresenter } from "./_logic/usePresenter";

// Decides which screen to show: the start hero, or the results screen once the field was focused. The focus keeper
// stays on both, so the keyboard survives the swap.
export const SearchPage: FC = () => {
    const { isStart } = usePresenter();

    return (
        <>
            {isStart ? <SearchHero /> : <ResultsScreen />}
            <FocusKeeper />
        </>
    );
};
