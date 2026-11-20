import { withViewTransition } from "@/lib/screen/withViewTransition";
import { useScreenStore } from "@/App/SearchPage/_stores/useScreenStore";
import { clearSearch } from "@/tasks/search/clearSearch";

type UsePresenterResult = {
    // The logo: back to the start screen, with the search cleared and the request on its way cancelled.
    onHome: () => void;
};

export const usePresenter = (): UsePresenterResult => {
    // The search is cleared inside the same transition as the swap, so the hero comes back with an empty field.
    const handleHome = (): void => {
        void withViewTransition(() => {
            clearSearch();
            useScreenStore.setState({ isStart: true });
        });
    };

    return { onHome: handleHome };
};
