import type { Handler } from "hono";
import type { UserEnv } from "~/tasks/types";
import { listFavorites } from "./_logic/_tasks/listFavorites";

// `GET /api/favorites`: the user's whole list, the newest first (`Favorite[]`); the only route that answers it.
export const getFavorites: Handler<UserEnv> = async (context) => {
    return context.json(await listFavorites(context.var.userId));
};
