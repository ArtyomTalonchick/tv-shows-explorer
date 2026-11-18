import type { DrawerProps } from "@/lib/components/Drawer/Drawer";
import { useFavoritesDrawerStore } from "@/App/_stores/useFavoritesDrawerStore";
import { useFavoritesStore } from "@/App/_stores/useFavoritesStore";
import type { FavoritesListProps } from "../FavoritesList/FavoritesList";

type UsePresenterResult = {
    drawer: Omit<DrawerProps, "children">;
    // Hidden while nothing is saved: the empty state explains how to add a show.
    list: FavoritesListProps | null;
};

export const usePresenter = (): UsePresenterResult => {
    const isOpen = useFavoritesDrawerStore((state) => state.isOpen);
    const setIsOpen = useFavoritesDrawerStore((state) => state.setIsOpen);
    const favorites = useFavoritesStore((state) => state.favorites);

    return {
        drawer: {
            open: isOpen,
            onClose: () => setIsOpen(false),
            eyebrow: "Your list",
            title: "Favourites",
            count: favorites.length,
            closeLabel: "Close favourites",
        },
        list: favorites.length > 0 ? { favorites } : null,
    };
};
