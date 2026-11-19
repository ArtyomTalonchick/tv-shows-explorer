import type { Handler } from "hono";
import { HttpError } from "@/lib/errors/HttpError";
import type { FavoriteEnv } from "@/routes/favorites/types";
import { listFavorites } from "@/tasks/favorites/listFavorites";
import { parseAddedAt } from "./_logic/parseAddedAt";
import { addFavorite } from "./_logic/_tasks/addFavorite/addFavorite";

// `PUT /api/favorites/:id` with an optional `AddFavoriteBody`: adds the show and answers the list; a show already
// there changes nothing. 404 when TVmaze has no such show, 502 when it does not answer.
export const putFavoritesById: Handler<FavoriteEnv, "/:id"> = async (context) => {
    const { clientId, showId } = context.var;
    const addedAt = parseAddedAt(await context.req.text(), Date.now());
    if (addedAt === null) {
        return context.json({ error: "Expected a JSON body with an optional addedAt from 1" }, 400);
    }

    try {
        await addFavorite(clientId, showId, addedAt, context.req.raw.signal);
    } catch (error) {
        if (error instanceof HttpError && error.status === 404) {
            return context.json({ error: "TVmaze has no such show" }, 404);
        }
        return context.json({ error: "TVmaze did not answer" }, 502);
    }
    return context.json(await listFavorites(clientId));
};
