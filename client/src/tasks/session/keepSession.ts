import type { SessionResponse } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useSessionStore } from "~/stores/useSessionStore";
import { addPendingFavorite } from "~/tasks/favorites/addPendingFavorite";
import { loadFavorites } from "~/tasks/favorites/loadFavorites";

// Keeps the session of a user who has just signed in or up, loads their favourites (`loadFavorites`), and then adds
// the show they bookmarked as a guest (`addPendingFavorite`): after the load, which would otherwise replace it. Never
// rejects: a load or an add that fails says nothing, and the show is not added.
export const keepSession = async (session: SessionResponse): Promise<void> => {
    // Taken before the session is kept: a kept session sends the user to the search at once, which forgets the show.
    const { pending } = useFavoritesStore.getState();
    useFavoritesStore.setState({ pending: null });
    useSessionStore.setState({ session });
    try {
        await loadFavorites();
        await addPendingFavorite(pending);
    } catch {
        // Silent: the sign-in itself succeeded, and a reload loads the list with a Retry of its own.
    }
};
