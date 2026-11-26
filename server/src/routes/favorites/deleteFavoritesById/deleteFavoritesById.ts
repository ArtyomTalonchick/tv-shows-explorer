import type { Context } from "hono";
import { withValid } from "~/lib/validation/withValid";
import { favoriteParamsSchema } from "~/tasks/favorites/favoriteParamsSchema";
import type { UserEnv } from "~/tasks/types";
import { removeFavorite } from "./_logic/_tasks/removeFavorite";

// `DELETE /api/favorites/:id`: removes the show and answers 204 with no body; a show that is not there changes
// nothing and is not an error. 400 when the path is not a `favoriteParamsSchema`.
export const deleteFavoritesById = withValid(
    { param: favoriteParamsSchema },
    async (context: Context<UserEnv>, { param }) => {
        await removeFavorite(context.var.userId, param.id);
        return context.body(null, 204);
    },
);
