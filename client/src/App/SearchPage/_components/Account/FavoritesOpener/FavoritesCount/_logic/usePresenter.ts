import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useIsSignedIn } from "~/stores/useSessionStore";

// The tone of the badge: grey for no favourites, the accent for some.
export type FavoritesCountTone = "zero" | "some";

type UsePresenterResult = {
    // A guest has no list, so no number.
    isShown: boolean;
    // The number of favourites; 0 is shown too, in a muted badge.
    count: number;
    tone: FavoritesCountTone;
};

export const usePresenter = (): UsePresenterResult => {
    const isShown = useIsSignedIn();
    const count = useFavoritesStore((state) => state.favorites.length);

    return { isShown, count, tone: count === 0 ? "zero" : "some" };
};
