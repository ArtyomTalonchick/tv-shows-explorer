import { sendFavoritesRequest } from "@/tasks/favorites/sendFavoritesRequest/sendFavoritesRequest";

// Adds the show to the browser's favorites. `addedAt` puts a removed show back in its old place (Undo); without it the
// show goes to the top. A show already there changes nothing.
export const addFavorite = async (id: number, addedAt?: number): Promise<void> => {
    await sendFavoritesRequest({ method: "PUT", id, body: addedAt === undefined ? undefined : { addedAt } });
};
