import type { Handler } from "hono";
import { listFavorites } from "@/routes/favorites/logic/tasks/listFavorites";
import type { FavoritesEnv } from "@/routes/favorites/logic/types";

// `GET /api/favorites`: the browser's list.
export const getFavorites: Handler<FavoritesEnv> = async (context) => {
    return context.json(await listFavorites(context.var.clientId));
};
