import { useFavoritesDrawerStore } from "~/App/_stores/useFavoritesDrawerStore";

type UsePresenterResult = {
    // Both links leave the page under the drawer, so they close it.
    close: () => void;
};

export const usePresenter = (): UsePresenterResult => {
    const setIsOpen = useFavoritesDrawerStore((state) => state.setIsOpen);

    return {
        close: () => setIsOpen(false),
    };
};
