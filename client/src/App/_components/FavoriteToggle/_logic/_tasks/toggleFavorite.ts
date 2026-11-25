import type { Show } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useSessionStore } from "~/stores/useSessionStore";
import { addFavorite } from "~/tasks/favorites/addFavorite";
import { removeFavorite } from "./removeFavorite";

// What a press on a bookmark did, known at once, before the server answers.
export type Toggling = {
    // A guest has no favourites: nothing changed and nothing was sent.
    isGuest: boolean;
    // Resolves once the server has the change; rejects as `addFavorite` and `removeFavorite` do, once the change is
    // rolled back.
    request: Promise<void>;
};

// Removes the show from the favorites when it is there, and adds it otherwise; the store changes at once. A guest's
// press changes nothing.
export const toggleFavorite = (show: Omit<Show, "rating">): Toggling => {
    if (useSessionStore.getState().session === null) {
        return { isGuest: true, request: Promise.resolve() };
    }
    const saved = useFavoritesStore.getState().findFavorite(show.id);
    if (saved === null) {
        return { isGuest: false, request: addFavorite(show) };
    }
    return { isGuest: false, request: removeFavorite(saved) };
};
