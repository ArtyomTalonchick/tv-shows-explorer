import type { Favorite, Show } from "@tv-shows-explorer/shared";
import { create } from "zustand";

type FavoritesState = {
    // The browser's favorites, the newest first: the list the server last answered, with the changes it answered
    // since; empty until the first answer.
    favorites: Favorite[];
    // The favorites removed since the favourites list last opened: their rows stay in the list, shown as removed,
    // and a show put back takes its old place.
    removed: Favorite[];
    // The show a guest bookmarked, added once they sign in or up; `null` when there is none. Kept in memory only: a
    // reload forgets it.
    pending: Omit<Show, "rating"> | null;
    // The favorite with this show id, or `null` when the show is not one.
    findFavorite: (id: number) => Favorite | null;
    // Puts the favorite in its place by `addedAt`, replacing the one with its id.
    addFavorite: (favorite: Favorite) => void;
    // A show that is not there changes nothing.
    removeFavorite: (id: number) => void;
    // The removed favorite with this show id, or `null` when the show was not removed since the list opened.
    findRemoved: (id: number) => Favorite | null;
    // Keeps a removed favorite, replacing the one with its id.
    rememberRemoved: (favorite: Favorite) => void;
    // A show that is not there changes nothing.
    forgetRemoved: (id: number) => void;
    // The list opens without the rows removed last time.
    clearRemoved: () => void;
};

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
    favorites: [],
    removed: [],
    pending: null,
    findFavorite: (id) => get().favorites.find((favorite) => favorite.id === id) ?? null,
    addFavorite: (favorite) =>
        set(({ favorites }) => {
            const others = favorites.filter(({ id }) => id !== favorite.id);
            const older = others.findIndex(({ addedAt }) => addedAt < favorite.addedAt);
            const at = older === -1 ? others.length : older;
            return { favorites: [...others.slice(0, at), favorite, ...others.slice(at)] };
        }),
    removeFavorite: (id) => set(({ favorites }) => ({ favorites: favorites.filter((favorite) => favorite.id !== id) })),
    findRemoved: (id) => get().removed.find((favorite) => favorite.id === id) ?? null,
    rememberRemoved: (favorite) =>
        set(({ removed }) => ({ removed: [...removed.filter(({ id }) => id !== favorite.id), favorite] })),
    forgetRemoved: (id) => set(({ removed }) => ({ removed: removed.filter((favorite) => favorite.id !== id) })),
    clearRemoved: () => set({ removed: [] }),
}));
