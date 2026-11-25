import { useFavoritesDrawerStore } from "~/App/_stores/useFavoritesDrawerStore";
import { useFavoritesStore } from "~/stores/useFavoritesStore";

type UsePresenterResult = {
    // Opens the list without the rows removed in it last time.
    open: () => void;
};

export const usePresenter = (): UsePresenterResult => {
    const setIsOpen = useFavoritesDrawerStore((state) => state.setIsOpen);
    const clearRemoved = useFavoritesStore((state) => state.clearRemoved);

    return {
        open: () => {
            clearRemoved();
            setIsOpen(true);
        },
    };
};
