import { useFavoritesDrawerStore } from "~/App/_stores/useFavoritesDrawerStore";

type UsePresenterResult = {
    open: () => void;
};

export const usePresenter = (): UsePresenterResult => {
    const setIsOpen = useFavoritesDrawerStore((state) => state.setIsOpen);

    return {
        open: () => setIsOpen(true),
    };
};
