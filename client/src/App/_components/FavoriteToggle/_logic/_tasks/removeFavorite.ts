import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useRemovedFavoritesStore } from "~/App/_stores/useRemovedFavoritesStore";
import { sendFavoritesRequest } from "~/tasks/favorites/sendFavoritesRequest";

// Removes the show from the browser's favorites: the store drops it at once, and a failed request puts it back in its
// place and rejects as `sendFavoritesRequest` does. The show is kept as removed until the favourites list opens
// again, so its row stays there and a show put back takes its old place.
export const removeFavorite = async (favorite: Favorite): Promise<void> => {
    useFavoritesStore.getState().removeFavorite(favorite.id);
    useRemovedFavoritesStore.getState().remember(favorite);

    try {
        await sendFavoritesRequest<void>({ method: "DELETE", id: favorite.id });
    } catch (error) {
        useFavoritesStore.getState().addFavorite(favorite);
        useRemovedFavoritesStore.getState().forget(favorite.id);
        throw error;
    }
};
