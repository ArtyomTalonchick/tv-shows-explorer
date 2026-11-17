import type { Handler } from "hono";
import { listFavorites } from "@/routes/favorites/_logic/tasks/listFavorites";
import type { FavoritesEnv } from "@/routes/favorites/_logic/types";

// `GET /api/favorites`: the browser's list.
export const getFavorites: Handler<FavoritesEnv> = async (context) => {
    return context.json(await listFavorites(context.var.clientId));
};
