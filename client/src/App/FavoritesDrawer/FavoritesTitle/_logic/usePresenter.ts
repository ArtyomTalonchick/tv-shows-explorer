import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useIsSignedIn } from "~/stores/useSessionStore";

type UsePresenterResult = {
    // A guest has no list, so no number.
    hasCount: boolean;
    // 0 is shown too.
    count: number;
};

export const usePresenter = (): UsePresenterResult => {
    const hasCount = useIsSignedIn();
    const count = useFavoritesStore((state) => state.favorites.length);

    return { hasCount, count };
};
