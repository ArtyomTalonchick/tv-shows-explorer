import { useSessionStore } from "~/App/_stores/useSessionStore";
import { useLoadFavoritesOnStart } from "./useLoadFavoritesOnStart";

type UsePresenterResult = {
    // A signed-in user is sent from the sign-in and sign-up pages to the search.
    isSignedIn: boolean;
};

// The app on start: it loads the favorites, and it knows whether the user is signed in.
export const usePresenter = (): UsePresenterResult => {
    useLoadFavoritesOnStart();
    const isSignedIn = useSessionStore(({ session }) => session !== null);

    return { isSignedIn };
};
