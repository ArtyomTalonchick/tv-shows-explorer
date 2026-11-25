import type { Favorite, Show } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useRemovedFavoritesStore } from "~/App/_stores/useRemovedFavoritesStore";
import { sendFavoritesRequest } from "~/tasks/favorites/sendFavoritesRequest";
import { toFavorite } from "./toFavorite";

// Adds the show to the browser's favorites: the store shows it at once, and a failed request takes it out again and
// rejects as `sendFavoritesRequest` does. The server's answer is not put into the store: the show is already there,
// and a removal made meanwhile must not be undone by it. A new show goes to the top; one removed since the list last
// opened goes back to its place, with its old `addedAt`.
export const addFavorite = async (show: Omit<Show, "rating">): Promise<void> => {
    const addedAt = useRemovedFavoritesStore.getState().find(show.id)?.addedAt ?? Date.now();
    useFavoritesStore.getState().addFavorite(toFavorite(show, addedAt));

    try {
        await sendFavoritesRequest<Favorite>({ method: "PUT", id: show.id, body: { addedAt } });
    } catch (error) {
        useFavoritesStore.getState().removeFavorite(show.id);
        throw error;
    }
};
