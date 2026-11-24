import { useFavoritesDrawerStore } from "~/App/_stores/useFavoritesDrawerStore";
import { useFavoritesStore } from "~/stores/useFavoritesStore";

type UsePresenterResult = {
    // The number of favourites; 0 is shown too, in a muted badge.
    count: number;
    countTone: "zero" | "some";
    open: () => void;
};

export const usePresenter = (): UsePresenterResult => {
    const count = useFavoritesStore((state) => state.favorites.length);
    const setIsOpen = useFavoritesDrawerStore((state) => state.setIsOpen);

    return {
        count,
        countTone: count === 0 ? "zero" : "some",
        open: () => setIsOpen(true),
    };
};
