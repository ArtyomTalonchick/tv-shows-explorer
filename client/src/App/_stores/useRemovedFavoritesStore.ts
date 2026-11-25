import type { Favorite } from "@tv-shows-explorer/shared";
import { create } from "zustand";

type RemovedFavoritesState = {
    // The favorites removed since the favourites list last opened: their rows stay in the list, shown as removed,
    // and a show put back takes its old place.
    removed: Favorite[];
    // The removed favorite with this show id, or `null` when the show was not removed since the list opened.
    find: (id: number) => Favorite | null;
    // Keeps a removed favorite, replacing the one with its id.
    remember: (favorite: Favorite) => void;
    // A show that is not there changes nothing.
    forget: (id: number) => void;
    // The list opens without the rows removed last time.
    clear: () => void;
};

export const useRemovedFavoritesStore = create<RemovedFavoritesState>()((set, get) => ({
    removed: [],
    find: (id) => get().removed.find((favorite) => favorite.id === id) ?? null,
    remember: (favorite) =>
        set(({ removed }) => ({ removed: [...removed.filter(({ id }) => id !== favorite.id), favorite] })),
    forget: (id) => set(({ removed }) => ({ removed: removed.filter((favorite) => favorite.id !== id) })),
    clear: () => set({ removed: [] }),
}));
