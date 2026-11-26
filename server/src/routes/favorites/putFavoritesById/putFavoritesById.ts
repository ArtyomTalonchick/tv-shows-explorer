import { addFavoriteBodySchema, HttpError } from "@tv-shows-explorer/shared";
import type { Context } from "hono";
import { withValid } from "~/lib/validation/withValid";
import { favoriteParamsSchema } from "~/tasks/favorites/favoriteParamsSchema";
import type { UserEnv } from "~/tasks/types";
import { addFavorite } from "./_logic/_tasks/addFavorite/addFavorite";

// `PUT /api/favorites/:id` with an `AddFavoriteBody`: adds the show and answers it (`Favorite`), at the body's
// `addedAt` or now; a show already there changes nothing and is answered as it is. 400 when the path is not a
// `favoriteParamsSchema` or the body not JSON of an `addFavoriteBodySchema`, 404 when TVmaze has no such show, 502
// when it does not answer.
export const putFavoritesById = withValid(
    { param: favoriteParamsSchema, json: addFavoriteBodySchema },
    async (context: Context<UserEnv>, { param, json }) => {
        const { userId } = context.var;
        try {
            const addedAt = json.addedAt ?? Date.now();
            return context.json(await addFavorite(userId, param.id, addedAt, context.req.raw.signal));
        } catch (error) {
            if (error instanceof HttpError && error.status === 404) {
                return context.json({ error: "TVmaze has no such show" }, 404);
            }
            return context.json({ error: "TVmaze did not answer" }, 502);
        }
    },
);
