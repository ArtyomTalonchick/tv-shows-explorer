import type { DrawerProps } from "~/lib/ui-kit/Drawer/Drawer";
import { useFavoritesDrawerStore } from "~/App/_stores/useFavoritesDrawerStore";
import { useFavoritesStore } from "~/stores/useFavoritesStore";

type UsePresenterResult = {
    // The title is the View's child component.
    drawer: Omit<DrawerProps, "title" | "children">;
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
            closeLabel: "Close favourites",
        },
        hasFavorites: count > 0,
    };
};
