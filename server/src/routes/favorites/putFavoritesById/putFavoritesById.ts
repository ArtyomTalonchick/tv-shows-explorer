import type { Handler } from "hono";
import { BAD_SHOW_ID } from "@/routes/favorites/logic/constants";
import { parseShowId } from "@/routes/favorites/logic/parseShowId";
import { listFavorites } from "@/routes/favorites/logic/tasks/listFavorites";
import type { FavoritesEnv } from "@/routes/favorites/logic/types";
import { HttpError } from "@/lib/errors/HttpError";
import { parseAddedAt } from "./logic/parseAddedAt";
import { addFavorite } from "./logic/tasks/addFavorite/addFavorite";

// `PUT /api/favorites/:id` with an optional `AddFavoriteBody`: adds the show and answers the list; a show already
// there changes nothing. 404 when TVmaze has no such show, 502 when it does not answer.
export const putFavoritesById: Handler<FavoritesEnv, "/:id"> = async (context) => {
    const { clientId } = context.var;
    const id = parseShowId(context.req.param("id"));
    if (id === null) {
        return context.json(BAD_SHOW_ID, 400);
    }
    const addedAt = parseAddedAt(await context.req.text(), Date.now());
    if (addedAt === null) {
        return context.json({ error: "Expected a JSON body with an optional addedAt from 1" }, 400);
    }

    try {
        await addFavorite(clientId, id, addedAt, context.req.raw.signal);
    } catch (error) {
        if (error instanceof HttpError && error.status === 404) {
            return context.json({ error: "TVmaze has no such show" }, 404);
        }
        return context.json({ error: "TVmaze did not answer" }, 502);
    }
    return context.json(await listFavorites(clientId));
};
