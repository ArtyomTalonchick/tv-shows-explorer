import { useIsSignedIn } from "~/stores/useSessionStore";

type UsePresenterResult = {
    // A signed-in user gets their menu next to the favourites; a guest gets the link to the sign-in page.
    isSignedIn: boolean;
};

export const usePresenter = (): UsePresenterResult => {
    const isSignedIn = useIsSignedIn();

    return { isSignedIn };
};
