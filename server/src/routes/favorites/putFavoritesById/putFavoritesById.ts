import { addFavoriteBodySchema } from "@tv-shows-explorer/shared";
import type { Context } from "hono";
import { HttpError } from "~/lib/errors/HttpError";
import { withValid } from "~/lib/validation/withValid";
import type { FavoriteEnv } from "~/routes/favorites/types";
import { addFavorite } from "./_logic/_tasks/addFavorite/addFavorite";

// `PUT /api/favorites/:id` with an `AddFavoriteBody`: adds the show and answers it (`Favorite`), at the body's
// `addedAt` or now; a show already there changes nothing and is answered as it is. 400 when the body is not JSON of
// an `addFavoriteBodySchema`, 404 when TVmaze has no such show, 502 when it does not answer.
export const putFavoritesById = withValid(
    { json: addFavoriteBodySchema },
    async (context: Context<FavoriteEnv>, { json }) => {
        const { userId, showId } = context.var;
        try {
            const addedAt = json.addedAt ?? Date.now();
            return context.json(await addFavorite(userId, showId, addedAt, context.req.raw.signal));
        } catch (error) {
            if (error instanceof HttpError && error.status === 404) {
                return context.json({ error: "TVmaze has no such show" }, 404);
            }
            return context.json({ error: "TVmaze did not answer" }, 502);
        }
    },
);
