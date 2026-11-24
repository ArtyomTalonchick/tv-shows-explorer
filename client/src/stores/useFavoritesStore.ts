import type { Favorite } from "@tv-shows-explorer/shared";
import { create } from "zustand";

type FavoritesState = {
    // The browser's favorites, the newest first: the list the server last answered, with the changes it answered
    // since; empty until the first answer.
    favorites: Favorite[];
    // The favorite with this show id, or `null` when the show is not one.
    findFavorite: (id: number) => Favorite | null;
    // Puts the favorite in its place by `addedAt`, replacing the one with its id.
    addFavorite: (favorite: Favorite) => void;
    // A show that is not there changes nothing.
    removeFavorite: (id: number) => void;
};

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
    favorites: [],
    findFavorite: (id) => get().favorites.find((favorite) => favorite.id === id) ?? null,
    addFavorite: (favorite) =>
        set(({ favorites }) => {
            const others = favorites.filter(({ id }) => id !== favorite.id);
            const older = others.findIndex(({ addedAt }) => addedAt < favorite.addedAt);
            const at = older === -1 ? others.length : older;
            return { favorites: [...others.slice(0, at), favorite, ...others.slice(at)] };
        }),
    removeFavorite: (id) => set(({ favorites }) => ({ favorites: favorites.filter((favorite) => favorite.id !== id) })),
}));
