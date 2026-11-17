import { create } from "zustand";

type FavoritesDrawerState = {
    // The favourites list is open over the page: the button of either screen opens it.
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

export const useFavoritesDrawerStore = create<FavoritesDrawerState>()((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
}));
