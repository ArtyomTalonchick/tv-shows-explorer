import { useScreenStore } from "../_stores/useScreenStore";

type UsePresenterResult = {
    isStart: boolean;
};

// The screens read the search state from the stores themselves; the page only chooses which one to show.
export const usePresenter = (): UsePresenterResult => {
    const isStart = useScreenStore((state) => state.isStart);

    return { isStart };
};
