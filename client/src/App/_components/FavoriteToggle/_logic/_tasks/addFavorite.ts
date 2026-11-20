import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "@/App/_stores/useFavoritesStore";
import { sendFavoritesRequest } from "@/tasks/favorites/sendFavoritesRequest/sendFavoritesRequest";

// Adds the show to the browser's favorites, and the favorite the server answers to the store. `addedAt` puts a removed
// show back in its old place (Undo); without it the show goes to the top. A show already there changes nothing.
// Rejects as `sendFavoritesRequest` does; the store then stays as it was.
export const addFavorite = async (id: number, addedAt?: number): Promise<void> => {
    const body = addedAt === undefined ? undefined : { addedAt };
    const favorite = await sendFavoritesRequest<Favorite>({ method: "PUT", id, body });
    useFavoritesStore.getState().addFavorite(favorite);
};
