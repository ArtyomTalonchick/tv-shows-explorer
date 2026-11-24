import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { sendFavoritesRequest } from "~/tasks/favorites/sendFavoritesRequest";

// Removes the show from the browser's favorites: the store drops it at once, and a failed request puts it back in its
// place and rejects as `sendFavoritesRequest` does.
export const removeFavorite = async (favorite: Favorite): Promise<void> => {
    useFavoritesStore.getState().removeFavorite(favorite.id);

    try {
        await sendFavoritesRequest<void>({ method: "DELETE", id: favorite.id });
    } catch (error) {
        useFavoritesStore.getState().addFavorite(favorite);
        throw error;
    }
};
