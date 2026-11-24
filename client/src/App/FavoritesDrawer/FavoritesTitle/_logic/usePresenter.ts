import { useFavoritesStore } from "~/stores/useFavoritesStore";

type UsePresenterResult = {
    // 0 is shown too.
    count: number;
};

export const usePresenter = (): UsePresenterResult => {
    const count = useFavoritesStore((state) => state.favorites.length);

    return { count };
};
