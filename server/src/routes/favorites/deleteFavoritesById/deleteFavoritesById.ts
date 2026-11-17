import type { Handler } from "hono";
import { BAD_SHOW_ID } from "@/routes/favorites/_logic/constants";
import { parseShowId } from "@/routes/favorites/_logic/parseShowId";
import { listFavorites } from "@/routes/favorites/_logic/tasks/listFavorites";
import type { FavoritesEnv } from "@/routes/favorites/_logic/types";
import { removeFavorite } from "./_logic/tasks/removeFavorite";

// `DELETE /api/favorites/:id`: removes the show and answers the list; a show that is not there changes nothing.
export const deleteFavoritesById: Handler<FavoritesEnv, "/:id"> = async (context) => {
    const { clientId } = context.var;
    const id = parseShowId(context.req.param("id"));
    if (id === null) {
        return context.json(BAD_SHOW_ID, 400);
    }

    await removeFavorite(clientId, id);
    return context.json(await listFavorites(clientId));
};
