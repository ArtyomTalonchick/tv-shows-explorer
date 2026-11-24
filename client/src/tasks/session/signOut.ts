import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useSessionStore } from "~/stores/useSessionStore";

// Signs the user out on this device: the session and the user's favourites are forgotten at once, with no request,
// and the page is a guest's: no star is on, the counter and the list are empty.
export const signOut = (): void => {
    useSessionStore.setState({ session: null });
    useFavoritesStore.setState({ favorites: [] });
};
