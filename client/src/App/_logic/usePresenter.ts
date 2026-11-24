import { useIsSignedIn } from "~/App/_stores/useSessionStore";
import { useLoadFavoritesOnStart } from "./useLoadFavoritesOnStart";
import { useRestoreSessionOnStart } from "./useRestoreSessionOnStart";

type UsePresenterResult = {
    // A signed-in user is sent from the sign-in and sign-up pages to the search.
    isSignedIn: boolean;
};

// The app on start: it refreshes the kept session and loads the favorites, and it knows whether the user is signed in.
export const usePresenter = (): UsePresenterResult => {
    useRestoreSessionOnStart();
    useLoadFavoritesOnStart();
    const isSignedIn = useIsSignedIn();

    return { isSignedIn };
};
