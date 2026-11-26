import { Hono } from "hono";
import { requireUser } from "~/tasks/session/requireUser";
import type { UserEnv } from "~/tasks/types";
import { deleteFavoritesById } from "./deleteFavoritesById/deleteFavoritesById";
import { getFavorites } from "./getFavorites/getFavorites";
import { requireShowId } from "./_logic/requireShowId";
import { putFavoritesById } from "./putFavoritesById/putFavoritesById";

// `/api/favorites`: the favorites of the signed-in user, named by the access token of `Authorization: Bearer`; 401
// without one. `GET` answers that user's whole list; a change answers only what it changed.
// prettier-ignore
export const favorites = new Hono<UserEnv>()
    .use(requireUser)
    .use("/:id", requireShowId)
    .get("/", getFavorites)
    .put("/:id", ...putFavoritesById)
    .delete("/:id", deleteFavoritesById);
