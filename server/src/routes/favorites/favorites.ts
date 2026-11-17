import { Hono } from "hono";
import { deleteFavoritesById } from "./deleteFavoritesById/deleteFavoritesById";
import { getFavorites } from "./getFavorites/getFavorites";
import { requireClientId } from "./logic/requireClientId";
import { putFavoritesById } from "./putFavoritesById/putFavoritesById";
import type { FavoritesEnv } from "./logic/types";

// `/api/favorites`: the favorites of one browser, named by the UUID it sends in the `X-Client-Id` header; there are
// no accounts. Each method answers that browser's whole list, the newest first (`Favorite[]`).
// prettier-ignore
export const favorites = new Hono<FavoritesEnv>()
    .use(requireClientId)
    .get("/", getFavorites)
    .put("/:id", putFavoritesById)
    .delete("/:id", deleteFavoritesById);
