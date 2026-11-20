import type { Favorite, Show } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "@/App/_stores/useFavoritesStore";
import { sendFavoritesRequest } from "@/tasks/favorites/sendFavoritesRequest";
import { toFavorite } from "./toFavorite";

// Adds the show to the browser's favorites: the store shows it at once, and a failed request takes it out again and
// rejects as `sendFavoritesRequest` does. The server's answer is not put into the store: the show is already there,
// and a removal made meanwhile must not be undone by it. `addedAt` puts a removed show back in its old place (Undo);
// without it the show goes to the top.
export const addFavorite = async (show: Omit<Show, "rating">, addedAt?: number): Promise<void> => {
    const body = addedAt === undefined ? undefined : { addedAt };
    useFavoritesStore.getState().addFavorite(toFavorite(show, addedAt ?? Date.now()));

    try {
        await sendFavoritesRequest<Favorite>({ method: "PUT", id: show.id, body });
    } catch (error) {
        useFavoritesStore.getState().removeFavorite(show.id);
        throw error;
    }
};
