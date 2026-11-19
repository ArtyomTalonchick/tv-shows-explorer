import type { Favorite } from "@tv-shows-explorer/shared";
import { create } from "zustand";

type FavoritesState = {
    // The browser's favorites as the server last answered them, the newest first; empty until the first answer.
    favorites: Favorite[];
    setFavorites: (favorites: Favorite[]) => void;
};

export const useFavoritesStore = create<FavoritesState>()((set) => ({
    favorites: [],
    setFavorites: (favorites) => set({ favorites }),
}));
