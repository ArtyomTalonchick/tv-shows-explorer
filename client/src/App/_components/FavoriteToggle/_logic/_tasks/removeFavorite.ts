import { useFavoritesStore } from "@/App/_stores/useFavoritesStore";
import { sendFavoritesRequest } from "@/tasks/favorites/sendFavoritesRequest/sendFavoritesRequest";

// Removes the show from the browser's favorites, and from the store once the server has answered; a show that is not
// there changes nothing. Rejects as `sendFavoritesRequest` does; the store then stays as it was.
export const removeFavorite = async (id: number): Promise<void> => {
    await sendFavoritesRequest<void>({ method: "DELETE", id });
    useFavoritesStore.getState().removeFavorite(id);
};
