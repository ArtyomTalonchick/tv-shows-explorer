import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useIsSignedIn } from "~/stores/useSessionStore";

type UsePresenterResult = {
    // A guest has no list, so no number.
    isShown: boolean;
    // The number of favourites; 0 is shown too, in a muted badge.
    count: number;
    tone: "zero" | "some";
};

export const usePresenter = (): UsePresenterResult => {
    const isShown = useIsSignedIn();
    const count = useFavoritesStore((state) => state.favorites.length);

    return { isShown, count, tone: count === 0 ? "zero" : "some" };
};
