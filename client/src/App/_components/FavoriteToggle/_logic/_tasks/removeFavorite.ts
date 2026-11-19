import { sendFavoritesRequest } from "@/tasks/favorites/sendFavoritesRequest/sendFavoritesRequest";

// Removes the show from the browser's favorites; a show that is not there changes nothing.
export const removeFavorite = async (id: number): Promise<void> => {
    await sendFavoritesRequest({ method: "DELETE", id });
};
