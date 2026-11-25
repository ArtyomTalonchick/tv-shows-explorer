import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";

type UsePresenterResult = {
    // The favorites and the shows removed since the list opened, each in its place: the newest first.
    favorites: Favorite[];
};

export const usePresenter = (): UsePresenterResult => {
    const favorites = useFavoritesStore((state) => state.favorites);
    const removed = useFavoritesStore((state) => state.removed);

    const gone = removed.filter(({ id }) => !favorites.some((favorite) => favorite.id === id));
    return { favorites: [...favorites, ...gone].sort((a, b) => b.addedAt - a.addedAt) };
};
