import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";

type UsePresenterResult = {
    // The newest first, as the store keeps them.
    favorites: Favorite[];
};

export const usePresenter = (): UsePresenterResult => {
    const favorites = useFavoritesStore((state) => state.favorites);

    return { favorites };
};
