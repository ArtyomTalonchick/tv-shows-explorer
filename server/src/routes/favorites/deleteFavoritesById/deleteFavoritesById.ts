import type { Handler } from "hono";
import type { FavoriteEnv } from "@/routes/favorites/types";
import { listFavorites } from "@/tasks/favorites/listFavorites";
import { removeFavorite } from "./_logic/_tasks/removeFavorite";

// `DELETE /api/favorites/:id`: removes the show and answers the list; a show that is not there changes nothing.
export const deleteFavoritesById: Handler<FavoriteEnv, "/:id"> = async (context) => {
    const { clientId, showId } = context.var;

    await removeFavorite(clientId, showId);
    return context.json(await listFavorites(clientId));
};
