import type { Handler } from "hono";
import type { FavoriteEnv } from "~/routes/favorites/types";
import { removeFavorite } from "./_logic/_tasks/removeFavorite";

// `DELETE /api/favorites/:id`: removes the show and answers 204 with no body; a show that is not there changes
// nothing and is not an error.
export const deleteFavoritesById: Handler<FavoriteEnv, "/:id"> = async (context) => {
    const { userId, showId } = context.var;

    await removeFavorite(userId, showId);
    return context.body(null, 204);
};
