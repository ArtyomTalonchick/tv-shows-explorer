import { useFavoritesDrawerStore } from "~/App/_stores/useFavoritesDrawerStore";
import { useRemovedFavoritesStore } from "~/App/_stores/useRemovedFavoritesStore";

type UsePresenterResult = {
    // Opens the list without the rows removed in it last time.
    open: () => void;
};

export const usePresenter = (): UsePresenterResult => {
    const setIsOpen = useFavoritesDrawerStore((state) => state.setIsOpen);
    const clearRemoved = useRemovedFavoritesStore((state) => state.clear);

    return {
        open: () => {
            clearRemoved();
            setIsOpen(true);
        },
    };
};
