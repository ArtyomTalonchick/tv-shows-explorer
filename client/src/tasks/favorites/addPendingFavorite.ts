import type { Show } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { addFavorite } from "./addFavorite";

// Adds the show a guest bookmarked before they signed in, once the user's list is loaded. No show, or one already
// saved, changes nothing and sends nothing. Rejects as `addFavorite` does, once the show is taken out again.
export const addPendingFavorite = async (pending: Omit<Show, "rating"> | null): Promise<void> => {
    if (pending === null || useFavoritesStore.getState().findFavorite(pending.id) !== null) {
        return;
    }
    await addFavorite(pending);
};
