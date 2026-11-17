import { useScreenStore } from "../../_stores/useScreenStore";
import { goHome } from "./goHome";
import { openResults } from "./openResults";

export type UseScreenSwapResult = {
    // The hero is shown on start and after the logo, whatever the field holds.
    isStart: boolean;
    // The screens are swapping: the caret of the results field is hidden.
    isSwapping: boolean;
    open: () => Promise<void>;
    goHome: () => Promise<void>;
};

// Which screen is shown, the start hero or the results screen, and the animated swap between them.
export const useScreenSwap = (): UseScreenSwapResult => {
    const isStart = useScreenStore((state) => state.isStart);
    const isSwapping = useScreenStore((state) => state.isSwapping);

    return { isStart, isSwapping, open: openResults, goHome };
};
