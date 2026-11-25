import type { SessionResponse, Show } from "@tv-shows-explorer/shared";
import { useSessionStore } from "~/stores/useSessionStore";
import { addPendingFavorite } from "~/tasks/favorites/addPendingFavorite";
import { loadFavorites } from "~/tasks/favorites/loadFavorites";

// Keeps the session of a user who has just signed in or up, loads their favourites (`loadFavorites`), and then adds
// the show they bookmarked as a guest, if any (`addPendingFavorite`): after the load, which would otherwise replace
// it. Never rejects: a load or an add that fails says nothing, and the show is not added.
export const keepSession = async (session: SessionResponse, pending: Omit<Show, "rating"> | null): Promise<void> => {
    useSessionStore.setState({ session });
    try {
        await loadFavorites();
        await addPendingFavorite(pending);
    } catch {
        // Silent: the sign-in itself succeeded, and a reload loads the list with a Retry of its own.
    }
};
