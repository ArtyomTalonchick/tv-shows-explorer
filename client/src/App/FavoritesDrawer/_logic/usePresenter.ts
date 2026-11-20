import type { DrawerProps } from "@/lib/components/Drawer/Drawer";
import { useFavoritesDrawerStore } from "@/App/_stores/useFavoritesDrawerStore";
import { useFavoritesStore } from "@/App/_stores/useFavoritesStore";

type UsePresenterResult = {
    drawer: Omit<DrawerProps, "children">;
    // The list, or while nothing is saved the empty state, which explains how to add a show.
    hasFavorites: boolean;
};

export const usePresenter = (): UsePresenterResult => {
    const isOpen = useFavoritesDrawerStore((state) => state.isOpen);
    const setIsOpen = useFavoritesDrawerStore((state) => state.setIsOpen);
    const count = useFavoritesStore((state) => state.favorites.length);

    return {
        drawer: {
            open: isOpen,
            onClose: () => setIsOpen(false),
            eyebrow: "Your list",
            title: "Favourites",
            count,
            closeLabel: "Close favourites",
        },
        hasFavorites: count > 0,
    };
};
