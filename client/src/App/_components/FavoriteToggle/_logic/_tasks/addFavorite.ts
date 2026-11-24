import type { Favorite, Show } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { sendFavoritesRequest } from "~/tasks/favorites/sendFavoritesRequest";
import { toFavorite } from "./toFavorite";

// Adds the show to the browser's favorites: the store shows it at once, and a failed request takes it out again and
// rejects as `sendFavoritesRequest` does. The server's answer is not put into the store: the show is already there,
// and a removal made meanwhile must not be undone by it. The show goes to the top.
export const addFavorite = async (show: Omit<Show, "rating">): Promise<void> => {
    useFavoritesStore.getState().addFavorite(toFavorite(show, Date.now()));

    try {
        await sendFavoritesRequest<Favorite>({ method: "PUT", id: show.id });
    } catch (error) {
        useFavoritesStore.getState().removeFavorite(show.id);
        throw error;
    }
};
