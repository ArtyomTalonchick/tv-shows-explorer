import type { SessionResponse } from "@tv-shows-explorer/shared";
import { useSessionStore } from "~/stores/useSessionStore";
import { loadFavorites } from "~/tasks/favorites/loadFavorites";

// Keeps the session of a user who has just signed in or up, and loads their favourites (`loadFavorites`). Never
// rejects: a load that fails says nothing, and the favourites stay empty until the next start.
export const keepSession = async (session: SessionResponse): Promise<void> => {
    useSessionStore.setState({ session });
    try {
        await loadFavorites();
    } catch {
        // Silent: the sign-in itself succeeded, and a reload loads the list with a Retry of its own.
    }
};
