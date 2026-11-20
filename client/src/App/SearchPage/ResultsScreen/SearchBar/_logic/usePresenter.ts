import { clearSearch } from "@/tasks/search/clearSearch";
import { goHome } from "./goHome";

type UsePresenterResult = {
    // The logo: back to the start screen, with the search cleared and the request on its way cancelled.
    onHome: () => void;
};

export const usePresenter = (): UsePresenterResult => {
    const handleHome = (): void => {
        void goHome(() => clearSearch());
    };

    return { onHome: handleHome };
};
