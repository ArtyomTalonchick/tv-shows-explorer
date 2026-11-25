import { useEffect } from "react";
import { useScreenStore } from "../_stores/useScreenStore";
import { forgetPendingFavorite } from "./_tasks/forgetPendingFavorite";

type UsePresenterResult = {
    isStart: boolean;
};

// The screens read the search state from the stores themselves; the page only chooses which one to show. On mount it
// forgets the show a guest bookmarked: a guest who comes back from the sign-in without signing in adds nothing later.
export const usePresenter = (): UsePresenterResult => {
    const isStart = useScreenStore((state) => state.isStart);

    useEffect(() => {
        forgetPendingFavorite();
    }, []);

    return { isStart };
};
