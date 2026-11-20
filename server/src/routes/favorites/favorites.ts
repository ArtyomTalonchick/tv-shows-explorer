import { Hono } from "hono";
import { deleteFavoritesById } from "./deleteFavoritesById/deleteFavoritesById";
import { getFavorites } from "./getFavorites/getFavorites";
import { requireClientId } from "./_logic/requireClientId/requireClientId";
import { requireShowId } from "./_logic/requireShowId/requireShowId";
import { putFavoritesById } from "./putFavoritesById/putFavoritesById";
import type { FavoritesEnv } from "./types";

// `/api/favorites`: the favorites of one browser, named by the UUID it sends in the `X-Client-Id` header; there are
// no accounts. `GET` answers that browser's whole list; a change answers only what it changed.
// prettier-ignore
export const favorites = new Hono<FavoritesEnv>()
    .use(requireClientId)
    .use("/:id", requireShowId)
    .get("/", getFavorites)
    .put("/:id", putFavoritesById)
    .delete("/:id", deleteFavoritesById);
