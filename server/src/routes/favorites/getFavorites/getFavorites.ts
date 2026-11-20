import type { Handler } from "hono";
import type { FavoritesEnv } from "@/routes/favorites/types";
import { listFavorites } from "./_logic/_tasks/listFavorites";

// `GET /api/favorites`: the browser's whole list, the newest first (`Favorite[]`); the only route that answers it.
export const getFavorites: Handler<FavoritesEnv> = async (context) => {
    return context.json(await listFavorites(context.var.clientId));
};
