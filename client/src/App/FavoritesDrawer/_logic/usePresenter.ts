import type { DrawerProps } from "~/lib/ui-kit/Drawer/Drawer";
import { useFavoritesDrawerStore } from "~/App/_stores/useFavoritesDrawerStore";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useIsSignedIn } from "~/stores/useSessionStore";

// A guest is asked to sign in; a user sees the list, or while nothing is saved how to add a show.
export type FavoritesContent = "guest" | "empty" | "list";

type UsePresenterResult = {
    // The title is the View's child component.
    drawer: Omit<DrawerProps, "title" | "children">;
    content: FavoritesContent;
};

export const usePresenter = (): UsePresenterResult => {
    const isSignedIn = useIsSignedIn();
    const isOpen = useFavoritesDrawerStore((state) => state.isOpen);
    const setIsOpen = useFavoritesDrawerStore((state) => state.setIsOpen);
    const count = useFavoritesStore((state) => state.favorites.length);

    const content = ((): FavoritesContent => {
        if (!isSignedIn) {
            return "guest";
        }
        if (count === 0) {
            return "empty";
        }
        return "list";
    })();

    return {
        drawer: {
            open: isOpen,
            onClose: () => setIsOpen(false),
            eyebrow: "Your list",
            closeLabel: "Close favourites",
        },
        content,
    };
};
